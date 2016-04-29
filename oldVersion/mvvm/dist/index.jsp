<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://www.gmmtour.com/tags" prefix="gm"%>
<%@ include file="/page/common/static.jsp" %>
<!DOCTYPE html>
<html class="single-screen">
<head>
    <meta charset="utf-8"/>
    <link rel="stylesheet" href="${WEB_STATIC}/common/css/bootstrap-system.css">
    
    <style>
        .btns-wrap dt{ padding: 5px 0; }
        .btns-wrap dd{ margin-bottom: 10px; }
    </style>

    <script src="${WEB_STATIC}/common/js/jquery1.9.1.min.js"></script>
    <script src="${WEB_STATIC}/common/js/bootstrap.js?v=1"></script>
    <script src="${WEB_STATIC}/common/plugins/pagination/pagination.js"></script>


</head>
<body>
<app></app>
<c:choose>
    <c:when test='${environmentFe eq "true"}'>
        <script src="/mvvm/dist/static/app.js"></script>
    </c:when>
    <c:otherwise>
        
        <script src="http://static.gmmtour.com/mvvm/dist/static/app.dd0312d19792b14263de.js"></script>
    </c:otherwise>
</c:choose>
</body>
</html>

