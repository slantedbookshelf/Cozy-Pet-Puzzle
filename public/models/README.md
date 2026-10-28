# 模型资产

当前版本没有外部 GLB/glTF 文件。猫、狗、兔子在 src/characters/pet.ts 中程序化建模。

后续模型每项需记录：文件名、模型名称、作者、来源链接、许可名称/链接、下载日期、修改说明及署名要求。使用 src/core/resources.ts 的 loadGLTF 接口加载，并在场景销毁时统一释放。
