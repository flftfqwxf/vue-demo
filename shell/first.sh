#!/usr/bin/env bash
sassPath="E:\wk11\static\oldVersion"
echo ${sassPath}
your_name="qinjx"
greeting="hello, "${your_name}" !"
greeting_1="hello, ${your_name} !"
greeting_3=${greeting}${greeting_1}${sassPath}
echo ${greeting:1:2}