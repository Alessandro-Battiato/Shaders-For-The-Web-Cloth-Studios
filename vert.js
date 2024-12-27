const vert = `
    ${includes}

    uniform float time;
    uniform vec2 touchUv;
    uniform float touchStrength;

    varying vec3 v_position;
    varying vec3 v_normal;
    varying vec2 v_uv;

    void main() {
        vec3 newPosition = position;

        vec3 wind = vec3(
            fbm(0.1 * position + 0.1 * time),
            fbm(0.2 * position - 0.1 * time),
            fbm(0.1 * position + 0.3 * time)
        );

        float wave = mix(-5.0, 5.0, fbm(0.1 * position + wind));

        // set two pegs, so as to make the top left and right extremes of the cloth stay put even when hovering over them
        vec2 peg1 = vec2(0.0, 1.0); // top left corner
        vec2 peg2 = vec2(1.0, 1.0); // opposite way

        float tension = distance(uv, peg1) * distance(uv, peg2);
        float gravity = -0.2 * sin(uv.x * 3.141);

        newPosition.y += gravity;
        newPosition.z += tension * wave;

        // how far away is the mouse
        float mouseDistance = distance(touchUv, uv);
        float mouseScore = smoothstep(0.5, 0.0, mouseDistance);

        // push backwards
        newPosition.z += mix(0.0, -3.0 * touchStrength, tension * mouseScore); // -6.0 is the depression strength caused by the hovering

        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    
        v_position = newPosition;
        v_normal = normal;
        v_uv = uv;
    }
`;
