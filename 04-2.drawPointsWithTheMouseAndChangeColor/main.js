var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
        'gl_Position = a_Position;\n' +
        'gl_PointSize = a_PointSize;\n' +
    '}\n'
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
   ' void main() {\n'+
        'gl_FragColor = u_FragColor;\n'+
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

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)

    gl.vertexAttrib1f(a_PointSize, 20.0)

    canvas.onmousedown = function(event) {click(event, gl ,canvas, a_Position, u_FragColor)}

    // 设置canvas背景色
    gl.clearColor(0.0,0.0,0.0,1.0)

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1)
}

var g_points = []
var g_colors = []
function click(event, gl ,canvas, a_Position, u_FragColor) {
    var x = event.clientX
    var y = event.clientY
    var rect = event.target.getBoundingClientRect()
    x = ((x - rect.left) - canvas.height/2) / (canvas.height/2);
    y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);

    g_points.push([x,y]);

    if(x >= 0.0 && y >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0])
    } else if(x < 0.0 && y < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0])
    }else {
        g_colors.push([1.0, 1.0, 1.0, 1.0])
    }

    gl.clear(gl.COLOR_BUFFER_BIT);  // 绘制点后，颜色缓冲区就被WebGL重置为默认的颜色（0.0， 0.0， 0.0， 0.0）
    var len = g_points.length;
    for(var j = 0; j < len; j++) {
        var xy = g_points[j];
        var rgba = g_colors[j];
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3] );
        gl.drawArrays(gl.POINTS, 0, 1)
    }
}