const VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    'v_TexCoord = a_TexCoord;\n' +
    'gl_Position = a_Position;\n' +
    // 'gl.PositSize = 30.0;\n' +
    '}\n';
const FSHADER_SOURCE =
    'precision mediump float;\n'+
    // 'uniform float u_Width;\n'+
    // 'uniform float u_Height;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'uniform sampler2D u_Sampler2;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){' +
    'vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
    'vec4 color2 = texture2D(u_Sampler2, v_TexCoord);\n' +
    'gl_FragColor = color1 * color2;\n' +
    '}';

// import textture from '../images/textture.jpeg'/

function main() {
    const canvas = document.getElementById('webgl')

    const gl = getWebGLContext(canvas)

    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    if(!initShaders(gl,VSHADER_SOURCE, FSHADER_SOURCE )) {
        console.error('Failed to  initialize shaders.')
    }

    const n = initVertexBuffers(gl)
    if(n < 0) {
        console.error('Failed to set the positions of the vertices')
    }

    if(!initTextures(gl,n)) {
        console.error('Failed to initialize Texture')
    }



}

function initVertexBuffers(gl) {
    const verticesTexCoords = new Float32Array([
        // 顶点坐标  纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ])
    let n = 4

    const vertexTexCoordBuffer = gl.createBuffer()

    if(!vertexTexCoordBuffer) {
        console.error('Failed to create the buffer object')
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer)

    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT



    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0)

    gl.enableVertexAttribArray(a_Position)

    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(a_TexCoord)


    return n
}

function initTextures(gl, n) {
    const texture1 = gl.createTexture() // 创建纹理对象
    const texture2 = gl.createTexture()

    const u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1') // 获取u_Sampler的存储位置
    const u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2')

    const image1 = new Image() // 创建一个image对象
    const image2 = new Image()
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
        console.log(333)
    }
    image2.onload = function () {
        loadTexture(gl, n ,texture2, u_Sampler2, image2, 2)
    }

    image1.onerror = function() {
        console.error('Failed to load image at ' + image1.src);
    };
    image1.src = './camel.png';
    // image.src='http://127.0.0.1:5501/images/vshaderAndFshader.png'
    image1.setAttribute("crossOrigin", "Anonymous");




    image2.src = './camel.png'

    image2.setAttribute("crossOrigin", "Anonymous");

    return true;
}

var g_texUnit1 = false, g_texUnit2 = false

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1) // 对纹理图像进行y轴反转

    if(texUnit == 1) {
        gl.activeTexture(gl.TEXTURE1)
        g_texUnit1 = true
    }else {
        gl.activeTexture(gl.TEXTURE2)
        g_texUnit2 = true
    }

    // gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D, texture)

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.uniform1i(u_Sampler, texUnit)

    console.log('Texture loaded:', image.width, image.height);



    // gl.drawArrays(gl.TRIANGLES, 0, n)

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)

    if(g_texUnit1 && g_texUnit2) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        gl.clear(gl.COLOR_BUFFER_BIT)
        console.log(4)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
    }
}