# CodeReviewServer服务端配套界面

这个是CodeReview检视IDEA插件配套服务端对应的界面源码仓库。

如果您需要获取配套的后端服务源码，从如下途径获取：

- [Github源码仓库](https://github.com/veezean/CodeReviewServer)

- [Gitee镜像仓库](https://gitee.com/veezean/CodeReviewServer)

如果您需要获取配套IDEA端CodeReview插件源码，从如下途径获取：

- [Github源码仓库](https://github.com/veezean/IntellijIDEA-CodeReview-Plugin)

- [Gitee镜像仓库](https://gitee.com/veezean/IntellijIDEA-CodeReview-Plugin)


## 一种更简单高效的代码review体验

在我们的项目开发过程中，代码`review`是不可或缺的一个环节。虽然市面上已有一些成熟的代码`review`系统，或者是基于`git`提交记录进行的在线review操作，也许其功能更强大，但是使用上总是不够方便：

- 代码不同于小说审稿，纯文本类型的阅读式review模式，很难发现逻辑层面的问题
- 代码review完成之后，针对评审意见的逐个确认、跟踪闭环也比较麻烦
- 平时项目开发的时候没法同步记录发现的问题
- ...

对于程序员来说，`IDEA`中查看代码才是最佳模式，在IDEA中可以跳转、搜索、分析调用，然后才能检视出深层的代码逻辑问题。此外，平时开发过程中，如果写代码的时候发现一些问题点，如果可以直接在IDEA中记录下来，然后交由对应责任人去修改，这样的代码review体验岂不是更方便、更高效。

基于此想法，利用业余时间开发了IDEA配套的代码review插件，上到应用时长之后，也收获了相对比较高的评分，也收到很多同学的私信赞扬，说明程序员“**苦code review久矣**”！

![](https://pics.codingcoder.cn/pics/202307222357867.png)

当然，随着使用的同学数量增加，也收到越来越多的同学反馈希望加一个团队协作能力，这样可以方便团队内评审活动的开展。

于是，在原有的本地review基础上，增加了插件配套的服务端，实现了团队内成员间代码review意见的管理、统计以及彼此的协同。

![](https://pics.codingcoder.cn/pics/202307230012353.png)

## 服务端使用教程

### 详细教程

点击查看 [服务端使用教程](https://blog.codingcoder.cn/post/codereviewserverdeploydoc.html)

### 界面示意图

![](https://pics.codingcoder.cn/pics/202307230022440.png)

![](https://pics.codingcoder.cn/pics/202307230022600.png)

![](https://pics.codingcoder.cn/pics/202307230023029.png)

![](https://pics.codingcoder.cn/pics/202307230023684.png)


## 前端源码运行说明

> 作者本身是后端开发，前端vue纯属现学现卖，只能说功能可用，前端太高级的功能还需要等等稍后逐步完善添加上去 ~O(∩_∩)O~

本项目使用`pnpm`进行安装编译。

1. 安装pnpm，并切换到淘宝源

```
npm install pnpm -g
pnpm config get registry
pnpm config set registry https://registry.npmmirror.com/
```

2. 在项目根目录下执行命令

```
pnpm install
```

3. 本地运行

```
pnpm run dev
```

4. 打包

```
pnpm run build
```

**补充说明**

如果采用前后端独立部署的方式，直接按照vue项目的方式去部署即可。

如果想要前后端一体化部署，则将编译打包后的`dist`目录下的内容，拷贝到服务端`src/resource/static`目录下，然后直接运行后端服务即可。


## 问题&建议

新版本上线，如果发现有bug或者有功能建议，欢迎提issue单，或者通过公众号`@架构悟道`联系到作者，获取更实时的答复与支撑。

![](https://pics.codingcoder.cn/pics/202307232025965.png)

当然，如果觉得本软件帮助到了您的工作，也欢迎支持我继续更新维护下去~

![](https://pics.codingcoder.cn/pics/202307231540263.png)
