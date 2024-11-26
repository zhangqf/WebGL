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

矩阵右乘矢量的结果是矢量。其中每个分量都是原矢量中的对应分量，乘上矩阵对应行的每个元素的积的和。