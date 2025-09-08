---
title: Effective C++
createTime: 2025/09/04 11:44:23
permalink: /article/c50zuh5b/
tags:
  - Learning
---

<p align="center">
  <img src="https://t13.baidu.com/it/u=4053926793,3613387764&fm=224&app=112&f=JPEG?w=500&h=500
  " width="300"><br>
  <b>《Effective C++》 - [美] Scott Meyers</b>
</p>

<LinkCard title="Z-Library: 《Effective C++》" href="https://zh.z-lib.gd/book/11368290/b56aad/effective-c.html"/>

## 第一章 让自己习惯 C++

### 01：试 C++为一个语言联邦

- C。说到底 C++仍是以 C 为基础。==区块、语句、预处理器、内置数据类型、数组、指针==等统统来自 C。许多时候 C++对问题的解法其实不过就是较高级的 C 解法，但当你以 C++ 内的 C 成分工作时，高效编程守则映照出 C 语言的局限:没有模板，没有异常,没有重载……
- Object-Oriented C++。这部分也就是 C with Classes 所诉求的: classes，==封装、继承、多态、virtual 函数(动态绑定)==……等等。这一部分是面向对象设计之古典守则在 C++上的最直接实施。
- Template C++。这是 C++的**泛型编程**部分，也是大多数程序员经验最少的部分。Template 相关考虑与设计已经弥漫整个 C++，良好编程守则中“惟 template 适用”的特殊条款并不罕见（例如条款 46 谈到调用 template functions 时如何协助类型转换）。实际上由于 templates 威力强大，它们带来崭新的**编程范型**，也就是所谓的 TM(模板元编程)。TMP 相关规则很少与 C++主流编程互相影响。
- **STL**。STL 是个 template 程序库,它对容器、迭代器、算法以及函数对象的规约有极佳的紧密配合与协调，然而 templates 及程序库也可以其他想法建置出来。STL 有自己特殊的办事方式，当你伙同 STL 一起工作，你必须遵守它的规约。

::: tip
C++高效编程守则是状况而变化，取决于你使用 C++的哪个部分。
:::

### 02: 尽量以 const, enum, inline 替换#define

```cpp
#define ASPECT RATIO 1.653
```

记号名称 `ASPECT_RATIO` 也许从未被编译器看见;也许在编译器开始处理源码之前它就被预处理器移走了。于是记号名称 `ASPECT_RATIO` 有可能没进入记号表(symboltable)内。于是当你运用此常量但获得一个编译错误信息时，可能会带来困惑，因为这个错误信息也许会提到 `1.653` 而不是 `ASPECT_RATIO` 。如果 `ASPECT_RATIO` 被定义在一个非你所写的头文件内，你肯定对 `1.653` 以及它来自何处毫无概念，于是你将因为追踪它而浪费时间。这个问题也可能出现在记号式调试器(symbolic debugger)中,原因相同:**你所使用的名称可能并未进入记号表(symboltable)。**

有一个值得注意的是 ==class 专属常量==。为了将常量的作用域限制于 class 内，你必须让它成为 class 的一个成员(member) ;而为确保此常量至多只有一份实体，你必须让它成为一个 static 成员:

```cpp
class GamePlayer {
private:
    static const int NumTurns = 5;   //常量声明式
    int scores[NumTurns];            //使用该常量
    ···
}
```

然而你所看到的是 NumTurns 的`声明式`而非`定义式`。通常 C++要求你对你所使用的任何东西提供一个定义式，但如果它是个 class 专属常量又是 static 且为整数类型(integral type,例如 ints, chars, bools)，则需特殊处理。只要不取它们的地址,你可以声明并使用它们而无须提供定义式。但如果你取某个 class 专属常量的地址,或纵使你不取其地址而你的编译器却（不正确地）坚持要看到一个定义式，你就必须另外提供定义式如下:

```cpp
const int GamePlayer : : NumTurns;  //NumTurns的定义;
                                    //下面告诉你为什么没有给予数值
```

这个式子放进一个实现文件而非头文件。由于 class 常量已在声明时获得初值(例如先前声明 NumTurns 时为它设初值 5)，因此定义时不可以再设初值。
