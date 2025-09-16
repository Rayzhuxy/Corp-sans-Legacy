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

### 01:试 C++为一个语言联邦

- C。说到底 C++仍是以 C 为基础。==区块、语句、预处理器、内置数据类型、数组、指针==等统统来自 C。许多时候 C++对问题的解法其实不过就是较高级的 C 解法，但当你以 C++ 内的 C 成分工作时，高效编程守则映照出 C 语言的局限:没有模板，没有异常,没有重载……
- Object-Oriented C++。这部分也就是 C with Classes 所诉求的: classes，==封装、继承、多态、virtual 函数(动态绑定)==……等等。这一部分是面向对象设计之古典守则在 C++上的最直接实施。
- Template C++。这是 C++的**泛型编程**部分，也是大多数程序员经验最少的部分。Template 相关考虑与设计已经弥漫整个 C++，良好编程守则中“惟 template 适用”的特殊条款并不罕见（例如条款 46 谈到调用 template functions 时如何协助类型转换）。实际上由于 templates 威力强大，它们带来崭新的**编程范型**，也就是所谓的 TM(模板元编程)。TMP 相关规则很少与 C++主流编程互相影响。
- **STL**。STL 是个 template 程序库,它对容器、迭代器、算法以及函数对象的规约有极佳的紧密配合与协调，然而 templates 及程序库也可以其他想法建置出来。STL 有自己特殊的办事方式，当你伙同 STL 一起工作，你必须遵守它的规约。

::: tip
C++高效编程守则是状况而变化，取决于你使用 C++的哪个部分。
:::

### 02::尽量以 const, enum, inline 替换#define

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
const int GamePlayer :: NumTurns;  //NumTurns的定义;
                                    //下面告诉你为什么没有给予数值
```

这个式子放进一个实现文件而非头文件。由于 class 常量已在声明时获得初值(例如先前声明 NumTurns 时为它设初值 5)，因此定义时不可以再设初值。

### 03:尽可能使用 const

`const`非常多才多艺。在 `classes`的外部，你可以将它用于`global`（全局）或 `namespace`（命名空间）范围的, 以及那些在 `file`、`function` 或区块作用域内被声明为==`static`的对象==。在 `classes`的内部，你可以将它用于`static`和非静态数据成员上。对于指针，你可以指定这个指针本身是`const`，或者它所指向的数据是`const`，或者两者都是，或者都不是：

```cpp
char greeting[] = "Hello";
char *p = greeting; // non-const pointer, non-const data
const char *p = greeting; // non-const pointer, const data
char * const p = greeting; // const pointer, non-const data
const char * const p = greeting; // const pointer, const data
```

::: warning
如果 const 出现在星号左边，则指针指向的内容为常量；如果 const 出现在星号右边，则指针自身为常量；如果 const 出现在星号两边，则两者都为 constant（常量）。
:::

STL 迭代器以指针为原型，所以一个迭代器在行为上非常类似于一个`T* pointer`指针。声明一个迭代器为 const 就类似于声明一个 pointer（指针）为 const（也就是说，声明一个 T* const pointer（指针））：不能将这个迭代器指向另外一件不同的东西，但是它所指向的东西本身可以变化。如果你要一个 iterator 指向一个不能变化的东西（也就是一个 const T* pointer 指针的 STL 对等物），你需要一个 `const_iterator`：

```cpp
std::vector<int> vec;
...
const std::vector<int>::iterator iter =     // iter acts like a T* const
  vec.begin();
*iter = 10;                                 // OK, changes what iter points to
// ++iter;                                     // error! iter is const

std::vector<int>::const_iterator cIter =    // cIter acts like a const T*
  vec.begin();
// *cIter = 10;                                // error! *cIter is const
++cIter;                                    // fine, changes cIter
```

一个函数返回一个常量值，常常可以在不放弃安全和效率的前提下尽可能减少客户的错误造成的影响。一个好的用户自定义类型的特点就是要避免与 built-ins（内建类型）毫无理由的不和谐。==将 operator\* 的返回值声明为 const 就可以避免这一点==，这就是我们要这样做的理由。

#### const 成员函数

::: tip
成员函数在只有常量性不同时是可以被重载的。
:::

```cpp
class TextBlock {
public:
  ...
  const char& operator[](std::size_t position) const   // operator[] for const objects
  { return text[position]; }                           // CTextBlock

  char& operator[](std::size_t position)               // operator[] for non-const objects
  { return text[position]; }                           // TextBlock

private:
   std::string text;
};
```

::: warning
non-const 版本的 operator[] 的返回类型是 `reference to a char` 而不是一个 `char` 本身。如果 operator[] 只是返回一个简单的 char，下面的语句将无法编译：`tb[0] = 'x';`因为==改变一个返回内建类的函数的返回值总是非法的==。即使它合法，C++ returns objects by value（以传值方式返回对象）这一事实也意味着被改变的是 tb.text[0] 的==一个拷贝==，而不是 tb.text[0] 自己，这不会是你想要的行为。
:::
::: note
改变一个返回内建类的函数的返回值总是非法如何理解：

```cpp
int getValue() {
    return 42; // 返回一个整数
}

int main() {
    getValue() = 100; // ❌ 非法！编译错误：lvalue required as left operand of assignment
    // 尝试改变函数返回的整数值 42，这是绝对不允许的。

    return 0;
}
```

内置类型的函数返回值是纯右值，不是左值，不能被赋值
:::

#### 避免 const 和 non-const 成员函数的重复

如果说 const 版本的 operator[] 所做的事也正是 non-const 版本所做的，仅有的不同是它有一个被 const 修饰的返回类型，==让 non-const operator[] 调用 const 版本也是避免重复代码的安全方法==。

```cpp
class TextBlock {
public:

  ...

  const char& operator[](std::size_t position) const     // same as before
  {

    ...
    return text[position];
  }

  char& operator[](std::size_t position) // 1. 这个函数返回一个可修改的char引用
  {
    return // 2. 整个函数的返回值就是后面的结果
      const_cast<char&>( // 4. 最后一步：去掉const属性，匹配函数返回类型
        static_cast<const TextBlock&>(*this) // 3a. 第一步：为*this加上const
          [position] // 3b. 第二步：调用const版本的operator[]
    );
    // // 1. 将当前对象（*this）转换为一个const引用
    // //    这确保了下一步调用的是 const版本的 operator[]，而不是自己（非const版本），避免了递归调用。
    // const TextBlock& constThis = *this;

    // // 2. 调用const版本的operator[]，它返回一个 const char&
    // const char& constCharRef = constThis[position];

    // // 3. 使用const_cast去掉返回的引用上的const属性，使其变为 char&
    // char& charRef = const_cast<char&>(constCharRef);

    // // 4. 返回这个可修改的引用
    // return charRef;

  }

...

};
```

::: warning
为什么不能反过来（const 版本调用非 const 版本）

因为非 const 的 operator[] ==可能会修改对象的状态（这是它的权利）==。而 const 版本的函数向编译器和使用者做出了一个庄严的承诺：“我绝不会修改这个对象的状态”。你通过 const_cast 去掉 const 并调用一个可能修改对象的函数，直接违背了这个承诺，会导致未定义行为。
:::

::: important

- 将某些东西声明为 const 可帮助编译器侦测出错误用法。const 可被施加于任何作用域内的对象、函数参数、函数返回类型、成员函数本体。
- 编译器强制实施 bitwise constness,但你编写程序时应该使用“概念上的常量性(conceptual constness)。
- 当 const 和 non-const 成员函数有着实质等价的实现时，令 non-const 版本调用 const 版本可避免代码重复。
  :::

### 04:确保对象在使用前被初始化

```cpp
class ABEntry {                         // ABEntry = "Address Book Entry"

public:

  ABEntry(const std::string& name, const std::string& address);

private:

  std::string theName;
  std::string theAddress;
  int num TimesConsulted;

};

ABEntry::ABEntry(const std::string& name, const std::string& address,)
{

  theName = name;                       // 这些都是赋值不是初始化
  theAddress = address;
  numTimesConsulted = 0;

}
```

C++ 的规则规定一个==对象的成员变量在进入构造函数的函数体之前被初始化==。在 ABEntry 的构造函数内，theName，theAddress 和 thePhones 不是被初始化，而是被赋值。初始化发生得更早——**在进入 ABEntry 的构造函数的函数体之前**，它们的缺省的构造函数已经被自动调用。但不包括 numTimesConsulted，因为它是一个内置类型。不能保证它在被赋值之前被初始化。

应该写成`ABEntry::ABEntry(const std::string& name, const std::string& address):theName(name), theAddress(address), numTimesConsulted(0){}`

::: note
C++对“定义于不同的编译单元内的 non-local static 对象”的初始化相对次序并无明确定义。这是有原因的:决定它们的初始化次序相当困难，非常困难，根本无解。==在其最常见形式，也就是多个编译单元内的 non-localstatic 对象经由“模板隐式具现化,implicit template instantiations”形成==(而后者自己可能也是经由“模板隐式具现化”形成)，不但不可能决定正确的初始化次序，甚至往往不值得寻找“可决定正确次序”的特殊情况。

要做的就是将每一个局部静态对象移到它自己的函数中，在那里它被声明为静态，即 Singleton 模式的常用实现手法。

```cpp
class FileSystem { ... };           //

FileSystem& tfs()                   // 这个函数用来替换tfs对象;
{                                   // 它在Filesystem class中可能是个static。
  static FileSystem fs;             // 定义并初始化一个local static对象，
  return fs;                        // 返回一个reference指向上述对象。
}

class Directory { ... };            // 同前

Directory::Directory( params )      // 同前，但原本的reference to tfs
{                                   // 现在改为tfs ()
  ...
  std::size_t disks = tfs().numDisks();
}

Directory& tempDir()                // 这个函数用来替换tempDir对象;
{                                   // 它在Directory class中可能是个static。
  static Directory td;              // 定义并初始化 local static对象，
  return td;                        // 返回一个reference指向上述对象。
}
```

:::

::: important

- 手动初始化内置类型的对象，因为 C++ 只在某些时候才会自己初始化它们。
- 在构造函数中，用成员初始化列表代替函数体中的赋值。初始化列表中数据成的排列顺序要与它们在类中被声明的顺序相同。
- 通过用局部静态对象代替非局部静态对象来避免跨转换单元的初始化顺序问题。
  :::

## 第二章 构造/析构/赋值运算

### 05:了解 C++ 为你偷偷地加上和调用了什么函数

如果你打算在一个“内含 reference 成员”的 class 内支持赋值操作 assignment，你必须自己定义 copy assignment 操作符。面对“内含 const 成员”(如本例之 obiectValue)的 classes,编译器的反应也一样。更改 const 成员是不合法的，所以编译器不知道如何在它自已生成的赋值函数内面对它们。最后还有一种情况:如果某个 basecasses 将 coPassignment 操作符声明为 private，编译器将拒绝为其 derived classes 生成一个 copyassignment 操作符。毕竟编译器为 derived classes 所生的 copy assignment 操作符想象中可以处理 base class 成分，但它们当然无法调用 derived class 无权调用的成员函数。编译器两手一摊，无能为力。

- 编译器可以暗自为 class 创建 default 构造函数、copy 构造函数、copyassignment 操作符，以及析构函数。

### 06:如果你不想使用编译器生成函数，就明确拒绝

解决这个问题的关键是所有的编译器生成的函数都是公有的。为了防止生成这些函数，你必须==将拷贝构造函数和拷贝赋值运算符声明为私有的==。通过显式声明一个成员函数，可以防止编译器生成它自己的版本，而且将这个函数声明为私有的，可以防止别人调用它。

```cpp
class HomeForSale {
public:
  ...

private:
  ...
  HomeForSale(const HomeForSale&);            // 仅声明即可
  HomeForSale& operator=(const HomeForSale&);
};
```

对于上面的类定义，编译器将阻止客户拷贝对象的企图，如果你不小心在成员或友元函数中这样做了，连接程序会提出抗议（因为没有函数参数的名称）。

::: note
或者可以将这两个函数==专门放在 Uncopyable 类里面然后其他类来继承他==。如果有人——甚至是成员或友元函数——试图拷贝一个 HomeForSale 对象，编译器将试图生成一个拷贝构造函数和一个拷贝赋值运算符。这些函数的**编译器生成版会试图调用基类的相应函数，而这些调用将被拒绝**，因为在基类中，拷贝操作是私有的。_这个类还会有其他妙用_。
:::

::: important

- 为了拒绝编译器自动提供的机能，将相应的 member functions（成员函数）声明为 private，而且不要给出 implementations（实现）。使用一个类似 Uncopyable 的 base class（基类）是方法之一。
  :::

### 07:在多态基类中将析构函数声明为虚拟

虚拟函数的实现要求对象携带额外的信息，这些信息用于在运行时确定该对象应该调用哪一个虚拟函数。典型情况下，这一信息具有一种被称为**vptr**（虚拟函数表指针）的指针的形式。vptr 指向一个被称为 vtbl（虚拟函数表）的函数指针数组，每一个带有虚拟函数的类都有一个相关联的 vtbl。**当在一个对象上调用虚拟函数时，实际的被调用函数通过下面的步骤确定：找到对象的 vptr 指向的 vtbl，然后在 vtbl 中寻找合适的函数指针**。

::: tip
当且仅当一个类中包含至少一个虚拟函数时，则在类中声明一个虚拟析构函数.
:::

::: important

- 多态基类应该声明虚拟析构函数。如果一个类有任何虚拟函数，它就应该有一个虚拟析构函）。
- 不是设计用来作为基类或不是设计用于多态的类就不应该声明虚拟析构函数。
  :::

### 08:别让异常逃离析构函数

在析构函数中吐出异常并不被禁止，但为了程序的可靠性，应当极力避免这种行为。

```cpp
class DBConn {
public:
    ...
    ~DBConn() {
        db.close();    // 该函数可能会抛出异常
    }

private:
    DBConnection db;
};
```

但这样我们就需要在析构函数中完成对异常的处理，以下是几种常见的做法：

第一种：杀死程序

```cpp
DBConn::~DBConn() {
    try { db.close(); }
    catch (...) {
        // 记录运行日志，以便调试
        std::abort();
    }
}
```

第二种：直接吞下异常不做处理，但这种做法不被建议。

第三种：重新设计接口，将异常的处理交给客户端完成：

```cpp
class DBConn {
public:
    ...
    void close() {
        db.close();
        closed = true;
    }

    ~DBConn() {
        if (!closed) {
            try {
                db.close();
            }
            catch(...) {
                // 处理异常
            }
        }
    }

private:
    DBConnection db;
    bool closed;
};
```

在这个新设计的接口中，我们提供了 close 函数供客户手动调用，这样客户也可以根据自己的意愿处理异常；若客户忘记手动调用，析构函数才会自动调用 close 函数。当一个操作可能会抛出需要客户处理的异常时，将其暴露在普通函数而非析构函数中是一个更好的选择。

:::important

- 析构函数绝对不要吐出异常。如果一个被析构函数调用的函数可能抛出异常，析构函数应该捕捉任何异常，然后吞下它们（不传播）或结束程序。
- 如果客户需要对某个操作函数运行期间抛出的异常做出反应，那么 class 应该提供一个普通函数（而非在析构函数中）执行该操作。
  :::

### 09:绝不在构造和析构过程中调用 virtual 函数

==不应该在构造或析构期间调用虚拟函数，因为这样的调用不会如你想象那样工作==。在构造函数和析构函数中调用虚函数，**不会发生多态行为（即不会调用派生类的重写版本）**。

由于 base class 构造函数的执行更早于 derived class 构造函数，当 base class 构造函数执行时 derived class 的成员变量尚未初始化。如果此期间调用的 virtual 函数下降至 derived classes 阶层，要知道 derived class 的函数几乎必然取用 local 成员变量，而那些成员变量尚未初始化。**因此，此时调用虚函数，编译器会直接解析到 Base 类中定义的版本，而不会去查找 Derived 的重写版本，因为从它的视角看，Derived 部分根本不存在。**

这将是一张通往不明确行为和彻夜调试大会串的直达车票。“要求使用对象内部尚未初始化的成分”是危险的代名词，所以 C++不让你走这条路。

相同道理也适用于析构函数。一旦 derived class 析构函数开始执行，对象内的 derived class 成员变量便呈现未定义值，所以 C++视它们仿佛不再存在。进入 baseclass 析构函数后对象就成为一个 base class 对象，而 C++的任何部分包括 virtual 函数、dynamic_casts 等等也就那么看待它。

因此唯一能够避免此问题的做法就是:确定你的构造函数和析构函数都没有（在对象被创建和被销毁期间）调用 virtual 函数，==而它们调用的所有函数也都服从同一约束==。

::: tip
既然直接调用不行，但如果确实需要在对象初始化时定制行为，解决方法如下：

- _将初始化工作分离_：不要在图构造函数中完成所有工作。提供一个像 initialize() 或 init() 的公共函数，在对象完全构造后由使用者调用。
- _将信息从派生类传递到基类构造函数_：这是更优雅、更常用的方法。**让派生类将必要的初始化信息作为参数，通过基类的构造函数传递上去。**

```cpp
class Base {
public:
    // 基类构造函数接收参数，而不是自己试图调用虚函数去获取
    explicit Base(const std::string& configInfo) {
        // 使用传入的 configInfo 进行初始化
        std::cout << "Base initialized with: " << configInfo << std::endl;
    }
    // ... 其他成员
};

class Derived : public Base {
public:
    Derived()
    : Base("Configuration for Derived") // 派生类决定传递给基类的信息
    {
    }
    // ... 其他成员
};
```

:::

::: important
在构造和析构期间不要调用 virtual 函数，因为这类调用从不下降至 derived class(比起当前执行构造函数和析构函数的那层)。
:::

### 10:让赋值运算符返回一个 reference to \*this

::: important
令赋值(assignment)操作符返回一个 reference to \*this。
:::

### 11:在 operator=中处理“自我赋值”

见“面向对象高级开发 1”中“对于拷贝赋值函数”处：

```cpp
String& String::operator=(const String& str)
{
   if (this == &str) //如果没有这一步，在进行c1 = c1的时候，下一步的delete操作会直接把内容清掉，后续操作无法进行，不仅仅是效率问题
      return *this;
      ...
}
```

::: note
使异常安全一般也同时弥补了它的自赋值安全。这就导致了更加通用的处理自赋值问题的方法就是忽略它，而将焦点集中于达到 e 异常安全。在本例中，已经足以看出，在很多情况下，仔细地调整一下语句的顺序就可以得到异常安全（同时也是自赋值安全）的代码。(只要注意不要删除 pb，直到我们拷贝了它所指向的目标之后)

```cpp
Widget& Widget::operator=(const Widget& rhs)
{
  Bitmap *pOrig = pb;               // 记住原先的 pb
  pb = new Bitmap(*rhs.pb);         // m令 pb 指向 *pb 的一个复件
  delete pOrig;                     // 删除原先的 pb

  return *this;
}
```

现在,如果“newBitmap"抛出异常，pb 及其栖身的那个 widget）保持原状。即使没有证同测试( identity test)，这段代码还是能够处理自我赋值，因为我们对原 bitmap 做了一份复件、删除原 bitmap、然后指向新制造的那个复件。它或许不是处理“自我赋值”的最高效办法，但它行得通。
:::
::: imtportant

- 确保当对象自我赋值时 operator=有良好行为。其中技术包括比较“来源对象”和“目标对象”的地址、精心周到的语句顺序、以及 copy-and-swap.
- 确定任何函数如果操作一个以上的对象，而其中多个对象是同一个对象时，其行为仍然正确。
  :::

### 12:复制对象时勿忘其每一个成分

任何时候只要你承担起“为 derived class 撰写 copying 函数”的重责大任，**必须很小心地也复制其 base class 成分**。那些成分往往是 private(见条款 22)，所以你无法直接访问它们，你应该让 derived class 的 copying 函数调用相应的 base class 函数:

```cpp
PriorityCustomer::PriorityCustomer(const PriorityCustomer& rhs)
:    Customer(rhs),                   // 调用base class的拷贝构造函数
  priority(rhs.priority)
{
  logCall("PriorityCustomer copy constructor");
}

PriorityCustomer&
PriorityCustomer::operator=(const PriorityCustomer& rhs)
{
  logCall("PriorityCustomer copy assignment operator");

  Customer::operator=(rhs);           // 对base class成分进行赋值动作
  priority = rhs.priority;

  return *this;
}
```

==当你写一个拷贝函数，需要保证（1）拷贝所有本地数据成员以及（2）调用所有基类中的适当的拷贝函数==。

::: note
用拷贝赋值运算符调用拷贝构造函数是没有意义的，因为你这样做就是试图去构造一个已经存在的对象。这太荒谬了，甚至没有一种语法来支持它。有一种语法看起来好像能让你这样做，但实际上你做不到，还有一种语法采用迂回的方法这样做，但它们在某种条件下会对破坏你的对象。所以我不打算给你看任何那样的语法。无条件地接受这个观点：不要用拷贝赋值运算符调用拷贝构造函数。

尝试一下另一种相反的方法——用拷贝构造函数调用拷贝赋值运算符——这同样是荒谬的。一个构造函数初始化新的对象，而一个赋值运算符只能用于已经初始化过的对象。借助构造过程给一个对象赋值将意味着对一个尚未初始化的对象做一些事，而这些事只有用于已初始化对象才有意义。

如果你发现你的拷贝构造函数和拷贝赋值运算符有相似的代码，通过创建第三个供两者调用的成员函数来消除重复。这样的函数当然是 private 的，而且经常叫做 init。这一策略是在拷贝构造函数和拷贝赋值运算符中消除代码重复的安全的，被证实过的方法。
:::

::: important

- 拷贝函数应该保证拷贝一个对象的所有数据成员以及所有的基类部分。
- 不要试图依据一个拷贝函数实现另一个。作为代替，将通用功能放入第三个供双方调用的函数。
  :::
