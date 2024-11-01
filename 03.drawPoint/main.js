var VSHADER_SOURCE =
    'void main() {\n' +
        'gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
        'gl_PointSize = 10.0;\n' +
    '}\n'
var FSHADER_SOURCE =
   ' void main() {\n'+
        'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n'+
    '}\n'


function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl) {
        console.error('Failed to get the rendering context for WebGL')
        return;
    }

    // 初始化着色器
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.')
        return;
    }

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1)
}