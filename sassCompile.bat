
::SASS ��������������,���д˳�����Ҫ��װ��Ӧ��GULP����ʹ��ʱ��ֱ��˫�����ļ����У�������ʾѡ��Ҫ�������Ŀ
CLS
@ECHO OFF
color 0a
TITLE sassWatch
SET sassPath=%~dp0oldVersion\
ECHO ***** 1 ����SASS����,��Ҫʵʱ���룬��ʹ��sassWatch.bat. ******
ECHO *****(ע�⣺���д˳�����Ҫ��װ��Ӧ��GULP��,�����޷�����,�����Ŀ¼��gulpfile.js��package.json) *****

choice /c 12345 /M ѡ��Ҫ�������Ŀ��1Ϊ���У�2Ϊsupplier,3Ϊdistributor,4Ϊbootstrap,5Ϊplugins
IF ERRORLEVEL 5 GOTO plugins
IF ERRORLEVEL 4 GOTO bootstrapScss
IF ERRORLEVEL 3 GOTO distributorScss
IF ERRORLEVEL 2 GOTO supplierScss
IF ERRORLEVEL 1 GOTO allScss

:allScss
ECHO ***** ����compile allScss*****
gulp allScss
GOTO end
:supplierScss
ECHO ***** ����compile supplier��Ŀ*****
gulp supplierScss
GOTO end
:distributorScss
ECHO ***** ����compile distributor��Ŀ*****
gulp distributorScss
GOTO end
:bootstrapScss
ECHO ***** ����compile bootstrap��Ŀ*****
gulp bootstrapScss
:plugins
ECHO ***** ����compile plugins����ģ��*****
gulp pluginsScss
GOTO end

:end
PAUSE