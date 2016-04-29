
::SASS 编译批处理命令,运行此程序需要安装相应的GULP包，使用时，直接双击此文件运行，根据提示选择要编译的项目
CLS
@ECHO OFF
color 0a
TITLE sassWatch
SET sassPath=%~dp0oldVersion\
ECHO ***** 1 启动SASS编译,需要实时编译，请使用sassWatch.bat. ******
ECHO *****(注意：运行此程序需要安装相应的GULP包,否则将无法运行,详见根目录的gulpfile.js和package.json) *****

choice /c 12345 /M 选择要编译的项目，1为所有，2为supplier,3为distributor,4为bootstrap,5为plugins
IF ERRORLEVEL 5 GOTO plugins
IF ERRORLEVEL 4 GOTO bootstrapScss
IF ERRORLEVEL 3 GOTO distributorScss
IF ERRORLEVEL 2 GOTO supplierScss
IF ERRORLEVEL 1 GOTO allScss

:allScss
ECHO ***** 正在compile allScss*****
gulp allScss
GOTO end
:supplierScss
ECHO ***** 正在compile supplier项目*****
gulp supplierScss
GOTO end
:distributorScss
ECHO ***** 正在compile distributor项目*****
gulp distributorScss
GOTO end
:bootstrapScss
ECHO ***** 正在compile bootstrap项目*****
gulp bootstrapScss
:plugins
ECHO ***** 正在compile plugins公共模块*****
gulp pluginsScss
GOTO end

:end
PAUSE