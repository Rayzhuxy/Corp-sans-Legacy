import { defineNoteConfig } from "vuepress-theme-plume";

export default defineNoteConfig({
  dir: "cpp",
  link: "/cpp/",
  sidebar: [
    "README.md",
    {
      text: "C++核心编程",
      prefix: "core",
      items: [
        "1-内存分区模型.md",
        "2-引用.md",
        "3-函数提高.md",
        "4-类和对象.md",
        "5-文件操作.md",
      ],
    },
    {
      text: "C++提高编程",
      prefix: "enhanced",
      items: [
        "1-模板.md",
        "2-STL基础.md",
        "3-STL常用容器.md",
        "4-STL函数对象.md",
        "5-STL常用算法.md",
      ],
    },
    {
      text: "C++面向对象高级开发",
      prefix: "oop",
      items: ["面向对象高级开发1.md", "面向对象高级开发2.md"],
    },
  ],
});
