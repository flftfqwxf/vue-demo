
::SASS WATCH���������ʹ��ʱ��ֱ��˫�����ļ����У�������ʾѡ��ҪWATCH����Ŀ
CLS
@ECHO OFF
color 0a
TITLE sassWatch
SET sassPath=%~dp0oldVersion\
ECHO *****  ����SASS WATCH ******
ECHO *****  ѡ��ҪWATCH����Ŀ ******
ECHO ***** 1Ϊ������Ŀ��ģ�� ******
ECHO ***** 2Ϊsupplier ��Ӧ����Ŀ ******
ECHO ***** 3Ϊdistributor ��������Ŀ ******
ECHO ***** 4Ϊbootstrap ������bootstrap ******
ECHO ***** 5Ϊplugins ������� ******
ECHO ***** 6Ϊmodule ����ҵ��ģ�� ******
choice /c 123456 /M ѡ��Ҫ�������Ŀ��1Ϊ���У�2Ϊsupplier,3Ϊdistributor,4Ϊbootstrap,5Ϊplugins,6Ϊmodule
IF ERRORLEVEL 7 GOTO consoleScss
IF ERRORLEVEL 6 GOTO module
IF ERRORLEVEL 5 GOTO plugins
IF ERRORLEVEL 4 GOTO bootstrapScss
IF ERRORLEVEL 3 GOTO distributorScss
IF ERRORLEVEL 2 GOTO supplierScss
IF ERRORLEVEL 1 GOTO allScss

:allScss
ECHO ***** ����watch allScss*****
sass -I %sassPath%  --watch %sassPath%supplier:%sassPath%supplier ^
 %sassPath%distributor:%sassPath%distributor ^
 %sassPath%console:%sassPath%console ^
 %sassPath%m:%sassPath%m ^
  %sassPath%www:%sassPath%www ^
 %sassPath%common:%sassPath%common ^
 %sassPath%common/bootstrap/scss:%sassPath%common/css
GOTO end
:supplierScss
ECHO ***** ����watch supplier��Ŀ*****
sass --watch %sassPath%supplier:%sassPath%supplier
GOTO end
:distributorScss
ECHO ***** ����watch distributor��Ŀ*****
sass -I %sassPath%  --watch %sassPath%distributor/theme/manage/blue/css:%sassPath%distributor/theme/manage/blue/css
GOTO end
:bootstrapScss
ECHO ***** ����watch bootstrap��Ŀ*****
sass -I %sassPath%  --watch %sassPath%common/bootstrap/scss:%sassPath%common/css
ECHO ***** ����watch plugins �������ģ��*****
:plugins
sass -I %sassPath%  --watch %sassPath%common/plugins:%sassPath%common/plugins
GOTO end
ECHO ***** ����watch module ����ҵ�� ģ��*****
:module
sass -I %sassPath%  --watch %sassPath%common/module:%sassPath%common/module
GOTO end
:consoleScss
sass -I %sassPath%  --watch %sassPath%console:%sassPath%console
GOTO end
:end
PAUSE