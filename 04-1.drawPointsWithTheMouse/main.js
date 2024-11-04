var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = a_PointSize;\n' +
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
    // 获取attribut变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')

    if(a_Position < 0) {
        console.error('Failed to get the storage location of a_Position')
        return;
    }
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    gl.vertexAttrib1f(a_PointSize, 20.0)

    canvas.onmousemove = function(event) {click(event, gl ,canvas, a_Position)}

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1)
}

var g_points = []

function click(event, gl ,canvas, a_Position) {
    var x = event.clientX
    var y = event.clientY
    var rect = event.target.getBoundingClientRect()
    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);

    g_points.push(x); g_points.push(y);
    gl.clear(gl.COLOR_BUFFER_BIT);  // 绘制点后，颜色缓冲区就被WebGL重置为默认的颜色（0.0， 0.0， 0.0， 0.0）
    var len = g_points.length;
    for(var j = 0; j < len; j+=2) {
        gl.vertexAttrib3f(a_Position, g_points[j], g_points[j+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1)
    }
}