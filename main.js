import { defs, tiny } from './examples/common.js';
import { Game } from "./game.js"
import * as Constants from "./constants.js"

const { Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene } = tiny;

export class Main_Scene extends Scene {
    constructor() {
        super();

        this.game = new Game();

        this.shapes = {
            sphere: new defs.Subdivision_Sphere(8),
            cube: new defs.Cube,
        };

        this.materials = {
            generic: new Material(new defs.Phong_Shader(), {ambient: 1, color: hex_color("#808080")}),
            road: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: .2, specularity: 0, color: hex_color("#151520")}),
            road_bound: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: .2, specularity: 0, color: hex_color("#101015")}),
            grass: new Material(new defs.Phong_Shader(), {ambient: .5, diffusivity: .3, specularity: .1, color: hex_color("#95e06c")}),
            grass_bound: new Material(new defs.Phong_Shader(), {ambient: .5, diffusivity: .3, specularity: .1, color: hex_color("#6CB047")}),
            cube: new Material(new defs.Phong_Shader(), {ambient: 1, diffusivity: 1, specularity: 1, color: hex_color("#a9fff7")})
        };

        Constants.CAMERA_PERSPECTIVE === "crossy" ?
            this.camera_location = Mat4.look_at(vec3(-4, 7, Constants.ROW_WIDTH / 2 + 2), vec3(1.5, 1, Constants.ROW_WIDTH / 2 + .5), vec3(0, 1, 0))
            :
            this.camera_location = Mat4.look_at(vec3(0, 8, Constants.ROW_WIDTH / 2), vec3(0, 0, Constants.ROW_WIDTH / 2), vec3(1, 0, 0));
    }

    make_control_panel() {
        this.key_triggered_button("Move Forward", ["w"], this.move_forward);
        this.key_triggered_button("Move Backwards", ["s"], this.move_backward);
        this.key_triggered_button("Move Left", ["a"], this.move_left);
        this.key_triggered_button("Move Right", ["d"], this.move_right);
        this.key_triggered_button("Restart", ["r"], this.restart_game);
    }

    move_forward() { // forward callback
        console.log("forward");
        this.game.player.row_num++;
        if (this.game.score < this.game.player.row_num) { // moving past the best score
            this.increment_score();
            this.generate_new_row();
        }
    }

    move_backward() { // backward callback
        console.log("backwards");
        this.game.player.row_num--;
        if (this.game.score - this.game.player.row_num > Constants.BACKWARDS_LIMIT) {
            this.restart_game();
        }
    }

    move_left() { // left callback
        console.log("left");
        if (this.game.player.index > Math.floor(Constants.ROW_WIDTH / 2) - Math.floor(Constants.PLAYABLE_WIDTH / 2) + 1) {
            this.game.player.index--;
        }
    }

    move_right() { // right callback
        console.log("right");
        if (this.game.player.index < Math.floor(Constants.ROW_WIDTH / 2) + Math.floor(Constants.PLAYABLE_WIDTH / 2) + 1) {
            this.game.player.index++;
        }
    }

    restart_game() {
        this.game = new Game();
    }

    display(context, program_state) {        
        
        if (!this.setup) {
            this.camera_setup(context, program_state);
            this.lighting_setup(program_state);
            this.setup = true;
        }

        this.draw_field(context, program_state);
        this.draw_player(context, program_state);
        this.move_camera(context, program_state);
    }

    camera_setup(context, program_state) {
        program_state.set_camera(this.camera_location);

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);
    }

    lighting_setup(program_state) {
        program_state.lights = [new Light(vec4(0, 10, Constants.ROW_WIDTH / 2, 1), color(.973, .957, .89, 1), 1000)];
    }

    draw_field(context, program_state) { // draw the field from the current game state
        (this.game.field.rows).forEach(row => {
            (row.row).forEach(tile => {
                let model_transform = Mat4.identity().times(Mat4.translation(row.row_num, 0, tile.index))
                    .times(Mat4.scale(.5, .5, .5));
                this.shapes.cube.draw(context, program_state, model_transform, this.get_field_material(tile.type));
            });
        });
    }

    draw_player(context, program_state) { // draw the player character
        // TODO: make the player more interesting than a cube (maybe a sphere? WOW so creative)
        let model_transform = Mat4.identity().times(Mat4.translation(this.game.player.row_num, 1, this.game.player.index))
            .times(Mat4.scale(.4, .5, .4))
        this.player_transform = model_transform;
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.cube);
    }

    move_camera(context, program_state) { // move the camera forward if needed
        if (this.game.player.row_num >= this.game.score) { // only move if we pass the best score

            // perform smoothing, modify at your own risk
            let desired_position = this.camera_location.times(Mat4.inverse(Mat4.translation(this.game.score - 1, 0, 0)));
            desired_position = desired_position.map((x, i) => Vector.from(Mat4.inverse(program_state.camera_transform)[i]).mix(x, .025));
            program_state.set_camera((desired_position));
        }
    }

    increment_score() {
        this.game.score++;
        console.log(this.game.score);
    }

    generate_new_row() {
        this.game.field.progress();
    }

    get_field_material(material_index) { // check what material corresponds to a given index
        switch(material_index) {
            case 0:
                return this.materials.road;
            case 1:
                return this.materials.grass;
            case 2:
                return this.materials.road_bound;
            case 3:
                return this.materials.grass_bound;
            default:
                return this.materials.generic;
        }
    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

                vertex_color = vec4(shape_color.xyz * ambient, shape_color.w);
                vertex_color.xyz += phong_model_lights(normalize(N), vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           
                // Compute an initial (ambient) color:
                //gl_FragColor = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                //gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );

                gl_FragColor = vertex_color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
            gl_Position = projection_camera_model_transform * vec4(position, 1.0);
            point_position = model_transform * vec4(position, 1.0);
            center = model_transform * vec4(0.0, 0.0, 0.0, 1.0);
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
            vec3 distance = vec3(point_position.xyz - center.xyz);
            gl_FragColor = vec4(vec3(0.6875, 0.5, 0.25), cos(length(distance) * 16.0));
        }`;
    }
}
