
::SASS WATCH批处理命令，使用时，直接双击此文件运行，根据提示选择要WATCH的项目
CLS
@ECHO OFF
color 0a
TITLE sassWatch
SET sassPath=%~dp0oldVersion\
ECHO *****  启动SASS WATCH ******
ECHO *****  选择要WATCH的项目 ******
ECHO ***** 1为所有项目和模块 ******
ECHO ***** 2为supplier 供应商项目 ******
ECHO ***** 3为distributor 分销商项目 ******
ECHO ***** 4为bootstrap 公共的bootstrap ******
ECHO ***** 5为plugins 公共组件 ******
ECHO ***** 6为module 公共业务模块 ******
choice /c 123456 /M 选择要编译的项目，1为所有，2为supplier,3为distributor,4为bootstrap,5为plugins,6为module
IF ERRORLEVEL 7 GOTO consoleScss
IF ERRORLEVEL 6 GOTO module
IF ERRORLEVEL 5 GOTO plugins
IF ERRORLEVEL 4 GOTO bootstrapScss
IF ERRORLEVEL 3 GOTO distributorScss
IF ERRORLEVEL 2 GOTO supplierScss
IF ERRORLEVEL 1 GOTO allScss

:allScss
ECHO ***** 正在watch allScss*****
sass -I %sassPath%  --watch %sassPath%supplier:%sassPath%supplier ^
 %sassPath%distributor:%sassPath%distributor ^
 %sassPath%console:%sassPath%console ^
 %sassPath%m:%sassPath%m ^
  %sassPath%www:%sassPath%www ^
 %sassPath%common:%sassPath%common ^
 %sassPath%common/bootstrap/scss:%sassPath%common/css
GOTO end
:supplierScss
ECHO ***** 正在watch supplier项目*****
sass --watch %sassPath%supplier:%sassPath%supplier
GOTO end
:distributorScss
ECHO ***** 正在watch distributor项目*****
sass -I %sassPath%  --watch %sassPath%distributor/theme/manage/blue/css:%sassPath%distributor/theme/manage/blue/css
GOTO end
:bootstrapScss
ECHO ***** 正在watch bootstrap项目*****
sass -I %sassPath%  --watch %sassPath%common/bootstrap/scss:%sassPath%common/css
ECHO ***** 正在watch plugins 公共组件模块*****
:plugins
sass -I %sassPath%  --watch %sassPath%common/plugins:%sassPath%common/plugins
GOTO end
ECHO ***** 正在watch module 公共业务 模块*****
:module
sass -I %sassPath%  --watch %sassPath%common/module:%sassPath%common/module
GOTO end
:consoleScss
sass -I %sassPath%  --watch %sassPath%console:%sassPath%console
GOTO end
:end
PAUSE