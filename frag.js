const frag = `
    ${includes}

    uniform sampler2D image;
    uniform float time;
    uniform vec2 mouse;
    uniform vec2 touchUv;

    varying vec3 v_position;
    varying vec3 v_normal;
    varying vec2 v_uv;

    struct Light {
        vec3 position;
        vec3 color;
    };

    vec3 addLight(Light l) {
        // calculate the new normals
        vec3 dx = dFdx(v_position);
        vec3 dy = dFdy(v_position);

        // new normal
        vec3 newNormal = normalize(cross(dx, dy));

        // light direction
        vec3 L = normalize(l.position - v_position);

        // surface direction
        vec3 N = mix(v_normal, newNormal, 0.5);

        // ambient lighting
        float ambientScore = 0.1;
        vec3 ambientColor = ambientScore * l.color;

        // diffuse lighting
        float diffuseScore = max(dot(L, N), 0.0); // 1 if both are the same direction, 0 if they are 90 degrees to each other, -1 if have opposite directions
        vec3 diffuseColor = diffuseScore * l.color;

        return ambientColor + diffuseColor;
    }

    void main() {
        vec4 objectColor = texture2D(image, v_uv);

        Light l = Light(
            vec3(0.0, 0.0, 10.0),
            vec3(1.0, 1.0, 1.0)
        );

        vec3 rgb = addLight(l) * objectColor.rgb;

        vec4 finalColor = vec4(rgb, 1.0);

        gl_FragColor = finalColor;
    }
`;
