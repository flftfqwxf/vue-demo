<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<dl id="idBox" class="lightbox">
  <dt id="idBoxHead"><b>截图</b></dt>
  <dd>
    <div id="screenshotDiv"></div>
    <input type="button" value="关闭 " id="idBoxCancel" />
  </dd>
</dl>
<input type="button" value="预览" id="idBoxOpen" onclick="showScreenshotDiv('banner')" />
<div id="screenshotImg">
    <img id="screenshotImgId" src="" data-src="" />
</div>
<form action="#" id="uploaderform">
</form>