# OpenGL ES 着色器语言（GLSL ES）

- 数据、变量和变量类型
- 矢量、矩阵、结构体、数组、采样器（纹理）
- 运算、程序流、函数
- attribute、uniform和varying变量
- 精度限定词
- 预处理和指令


## 数据值类型（数值和布尔值）

- 数值类型：GLSL ES 支持整型数 和 浮点数。没有小数点的值被认为是整型数，而有小数点的值被认为是浮点数。
- 布尔值类型：GLSL ES 支持布尔值类型，包括true和false两个布尔常量

**GLSL ES 不支持字符串类型，虽然字符串对三维图形语言来说还是有一定意义的**

**GLSL ES 关键字**

---
attribute bool break bvec2 bvec3 bvec4 const continue discard do else false float for highp if in inout Int invariant ivec2
ivec3 ivec4 lowp mat2 mat3 mat4 medium out precision return sampler2D samplerCube struct true uniform varying vec2 vec3 vec4
void while
---

**GLSL ES 保留字**

---
asm cast class default double dvec2 dvec3 dvec4 enum extern external fixed flat fvec2 fvec3 fvec4 goto half hvec2 hvec3 hvec4
inline input interface long namespace noinline output packed public sampler1D sampler1DShadow sampler2DRect sampler2DRectShadow
sampler2DShadow sampler3D sampler3DRect short sizeof static superp switch template this typedef union unsigned using volatile
---

**基本类型**

GLSL的基本类型

| 类型    | 描述                            |
|-------|-------------------------------|
| float | 单精度符点数类型。该类型的变量表示一个单精度浮点数     |
| int   | 整型数。该类型的变量表示一个整数              |
| bool  | 布尔值。该类型的变量表示一个布尔值（true或false） |


## 矢量和矩阵

| 类别 | GLSL ES 数据类型                                               | 描述                                                        |
|----|------------------------------------------------------------|-----------------------------------------------------------|
| 矢量 | vec2，vec3,vec4<br/>ivec2,ivec3,ivec4<br/>bvec2,bvec3,bvec4 | 具有2，3，4个浮点数元素的矢量<br/>具有2，3，4个整型元素的矢量<br/>具有2，3，4个布尔值元素的矢量 |
| 矩阵 | mat2,mat3,mat4                                             | 2x2,3x3,4x4的符点数元素的矩阵（分别具有4，9，16个元素）                       |


**专门创建指定类型的变量的函数被称为`构造函数`,构造函数的名称和其创建的变量的类型名称总是一致的**

### 矢量构造函数

```GLSL ES
vec3 v3 = vec3(1.0, 0.0, 0.5) // 将v3设为（1.0, 0.0, 0.5)
vec2 v2 = vec2(v3) // 使用v3的前两个元素，将v2设为（1.0, 0.0)
vec4 v4 = vec4(1.0) // 将v4设为（1.0, 1.0, 1.0, 1.0)
```

### 矩阵构造函数

矩阵构造函数的使用方式与矢量构造函数的使用方式很类型。但是，要保证存储在矩阵中的元素是安装列主序排序的。

```GLSE ES
mat4 m4 = (1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0);
```
$$
 \begin{bmatrix}
  1.0 & 5.0 & 9.0 & 13.0
  2.0 & 6.0 & 10.0 & 14.0
  3.0 & 7.0 & 11.0 & 15.0
  4.0 & 8.0 & 12.0 & 16.0
 \end{bmatrix}
$$

### 访问元素

为了访问矢量或矩阵中的元素，可以使用. 或 [] 运算符

### 运算符

在矢量变量名后接点运算符，然后接上分量名，就可以访问矢量的元素了

| 类别      | 描述         |
|---------|------------|
| x,y,z,w | 用来获取顶点坐标分量 |
| r,g,b,a | 用来获取颜色分量   |
| s,t,p,q | 用来获取纹理坐标分量 |

```GLSE ES
vec3 v3 = vec3(1.0, 2.0, 3.0)

float f;

f = v3.x // 1.0
f = v3.y // 2.0
f = v3.z // 3.0

f = v3.r // 1.0
f = v3.s // 1.p

```
x、r 和s 虽然名称不同，但访问的却是第一个分量

**混合**

将（同一个集合的）多个分量名共同置于点运算符后，就可以从矢量中同时抽取出多个分量。

```GLSE ES
vec2 v2;

v2 = v3.xy // (1.0, 2.0)
v2 = v3.yz // (2.0, 3.0)
v2 = v3.xz // (1.0, 3.0)
v2 = v3.yx // (2.0, 1.0)
v2 = v3.xx // (1.0, 1,0)

vec3 v3a;
v3a = v3.zyx // (3.0, 2.0, 1.0)
```

### 矢量和浮点数的运算

矢量和符点数的运算 是将矢量的每个分量都与此浮点数进行运算

```cpp
v3b = v3a + f;

v3b.x = v3a.x + f
v3b.y = v3a.y + f
v3b.z = v3a.z + f
```

### 矢量运算

矢量运算操作发生在矢量的每个分量上
```cpp

v3c = v3a + v3b

v3a.x + v3b.x
v3a.y + v3b.y
v3a.z + v3b.z

v3a = vec3(1.0, 2.0, 3.0)
v3b = vec3(4.0, 5.0, 6.0)

v3c =(5.0, 7.0, 9.0)
```

### 矩阵和浮点数的运算

矩阵与符点数的运算发生在矩阵的每个分量上

```c
m3b = m3a * f

m3b[0].x = m3a[0].x * f
m3b[0].y = m3a[0].y * f
m3b[0].z = m3a[0].z * f
m3b[1].x = m3a[1].x * f
m3b[1].y = m3a[1].y * f
m3b[1].z = m3a[1].z * f
m3b[2].x = m3a[2].x * f
m3b[2].y = m3a[2].y * f
m3b[2].z = m3a[2].z * f
```

### 矩阵右乘矢量

矩阵右乘矢量的结果是矢量。其中每个分量都是原矢量中的对应分量，乘上`矩阵对应行`的每个元素的积的和。


### 矩阵左乘矢量

矩阵左乘矢量的结果是矢量。其中每个分量都是原矢量中的对应分量，乘上`矩阵对应列`的每个元素的积的和。

### 矩阵与矩阵相乘

矩阵相乘的条件：

设有两个矩阵：
- 矩阵A：维度为 m x n
- 矩阵B：维度为 n x p

只有当矩阵*A*的列数（n）等于矩阵*B*的行数（n）时，才能进行相乘。结果矩阵*C*的维度为 m x p

### 结构体

GLSL ES 支持用户自定义的类型，即**结构体**，使用关键字struct，将已存在的类型聚合到一起，就可以定义为结构体。

```glsl
struct light { // 定义了结构体类型light
 vec4 color;
 vec3 position;
}

light l1, l2; // 声明了light类型的l1 和 l2

```

### 数组

GLSL ES 支持数组类型。与javascript中的数组不同的是，GLSL ES只支持一维数组，而且数组对象不支持pop()和push()等操作，创建数组时不需要使用new运算符。声明数组很简单，只需要在变量名后加上中括号（[]）
和数组的长度

float floatArray[4] // 声明含有4个浮点数元素的数组
vec4 vec4Array[2] // 声明含有2个vec4对象的数组

数组的长度必须是大于0的`整型常量表达式`。只有`整型常量表达式`和`uniform变量`可以被用作数组的索引值。此外，与javascript或c不同，数组不能在声明时被一次性地初始化，
而必须显式地对每个元素进行初始化

vec4Array[0] = vec4(4.0, 1.0, 3.0, 4.0)
vec4Array[1] = vec4(3.0, 2.0, 4.0, 5.0)


### 取样器（纹理）

GLSL ES支持的一种内置类型为**取样器**，必须通过该类型变量访问纹理。有两种基本的取样器类型：`sampler2D`和`samplerCube`。取样器变量只能是uniform变量，或者需要访问纹理的函数，
如`texture2D`函数的参数

如：uniform sampler2D u_Sampler;

此外，唯一能赋值给取样器变量的就是纹理单元编号，而且必须使用WebGL方法`gl.uniform1i()`来进行赋值。

取样器类型变量受到着色器支持的纹理单元的最大数量限制。`mediump`是一个精度限定字

**着色器中取样类型变量的最小数量**

| 着色器   | 表示最大数量的内置常量                                     | 最小数量 |
|-------|-------------------------------------------------|------|
| 顶点着色器 | const mediump int gl_MaxVertexTextureImageUnits | 0    |
| 片元着色器 | const mediump int gl_MaxTextureImageUnits       | 8    |

### 程序流程控制： 分支和循环

着色器中的分支与循环与javascript或C中的几乎无异

### 规范声明

如果函数定义在其调用之后，那么我们必须在进行调用之前先声明该函数的规范。规范声明会预先告诉WebGL系统函数的参数、参数类型、返回值等。

### 参数限定词

可以为函数参数指定限定字，以控制参数的行为。可以将函数参数定义成：
- 传递给函数的
- 将要在函数中被赋值的
- 既是传递给函数的，也是将要在函数中被赋值的

| 类别        | 规则                  | 描述                                           |
|-----------|---------------------|----------------------------------------------|
| in        | 向函数中传入值             | 参数传入函数，函数内可以使用参数的值，也可以修改其值。但函数内部的修改不会影响传入的变量 |
| const in  | 向函数中传入值             | 参数传入函数，函数内可以使用参数的值，但不能修改                     |
| out       | 在函数中被赋值，并被传出        | 传入变量的引用，若其在函数内被修改，会影响到函数外部传入的变量              |
| inout     | 传入函数，同时在函数中被赋值，并被传出 | 传入变量的引用，函数会用到变量的初始值，然后修改变量的值。会影响到函数外部传入的变量   |
| \< 无：默认\> | 将一个值传给函数            | 和in一样                                        |

```glsl
void luma2(in vec3 color, out float brightness) {
 birghtness = 0.2126 * color.r + 0.7162 * color.g + 0.0722 * color.b
}

float luma(vec4 color) {
 return 0.2126 * color.r + 0.7162 * color.g + 0.0722 * color.b
}

/*
 函数结果存储在brightness中，和brightness = luma（color）的效果相同
*/
luma2(color, brightness);
```

### 内置函数

**GLSL ES内置函数**

| 类型     | 内置函数                                                                                                                                                                                  |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 角度函数   | radians（角度制转弧度制），degrees（弧度制转角度制）                                                                                                                                                     |
| 三角函数   | sin（正弦函数），cos（余弦函数），tan（正切），asin（反正弦），acos（反余弦），atan（反正切）                                                                                                                             |
| 指数函数   | pow（$x^y$)，exp（自然指数），log（自然对数），exp2（$2^x$）,log2(以2为底数的对数），sqrt（开平方），inversesqrt（开平方的倒数）                                                                                               |
| 通用函数   | abs（取绝对值），min（最小值），max（最大值），mod（取余数），sign（取正负号），floor（向下取整），ceil（向上取整），<br/>clamp（限定范围），mix（线性内插），step（步进函数），smoothstep（艾米内插步进），fract（获取小数部分）                                         |
| 几何函数   | length（矢量长度），distance（两点间距离），dot（内积），cross（外积），normalize（归一化），reflect（矢量反射），faceforward（是向量“超前”）                                                                                      |
| 矩阵函数   | matrixCmpMult（逐元素乘法）                                                                                                                                                                  |
| 矢量函数   | lessThan（逐元素小于），lessThanEqual（逐元素小于等于），greaterThan（逐元素大于），greaterThanEqual（逐元素大于等于）<br/>，equal（逐元素相等），notEqual（逐元素不等），any（任一元素为true则为true），all（所有元素为true则为true），not（逐元素取补）            | 
| 纹理查询函数 | texture2D（在二维纹理中获取纹素），textureCube（在立方体纹理中获取纹素），texture2DProj（texture2D的投影版本），<br/>texture2DLod（texture2D的金字塔版本），textureCubeLod（textureCube的金字塔版本），texture2DProjLod（texture2DLod的投影版本） |
