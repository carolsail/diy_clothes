var canvas_front,canvas_back,canvas_right,canvas_left,canvas_current;
var step_obj = {};
function init(obj){
  var url = 'json/'+obj.c+'/'+obj.p+'/'+'source.json';
  $.get(url,function(obj){
    var area_front='',area_back='',area_left='',area_right='';
    $.each(obj.front.area,function(k,v){
      area_front += "<area shape='poly'name='"+v.name+"' coords='"+v.coords+"' data-color=''>";
    });
    $('#map_front').html(area_front);
    canvas_front.setBackgroundImage(obj.front.img, canvas_front.renderAll.bind(canvas_front),{});
    $.each(obj.back.area,function(k,v){
      area_back += "<area shape='poly'name='"+v.name+"' coords='"+v.coords+"' data-color=''>";
    });
    $('#map_back').html(area_back);
    canvas_back.setBackgroundImage(obj.back.img, canvas_back.renderAll.bind(canvas_back),{});
    $.each(obj.left.area,function(k,v){
      area_left += "<area shape='poly'name='"+v.name+"' coords='"+v.coords+"' data-color=''>";
    });
    $('#map_left').html(area_left);
    canvas_left.setBackgroundImage(obj.left.img, canvas_left.renderAll.bind(canvas_left),{});
    $.each(obj.right.area,function(k,v){
      area_right += "<area shape='poly'name='"+v.name+"' coords='"+v.coords+"' data-color=''>";
    });
    $('#map_right').html(area_right);
    canvas_right.setBackgroundImage(obj.right.img, canvas_right.renderAll.bind(canvas_right),{});
    //===默认显示front
    canvas_current = canvas_front;
    $('#canvas_back,#canvas_left,#canvas_right').parent().hide();
    $('.back,.left,.right').hide();
    $('#canvas_front').parent().show();
    $('.front').show();
  })
}

function direction(d){
  switch(d){
    case 'front':
      canvas_current = canvas_front;
      $('#canvas_back,#canvas_left,#canvas_right').parent().hide();
      $('.back,.left,.right').hide();
      $('#canvas_front').parent().show();
      $('.front').show();
    break;
    case 'back':
      canvas_current = canvas_back;
      $('#canvas_front,#canvas_left,#canvas_right').parent().hide();
      $('.front,.left,.right').hide();
      $('#canvas_back').parent().show();
      $('.back').show();
    break;
    case 'left':
      canvas_current = canvas_left;
      $('#canvas_back,#canvas_front,#canvas_right').parent().hide();
      $('.back,.front,.right').hide();
      $('#canvas_left').parent().show();
      $('.left').show();
    break;
    case 'right':
      canvas_current = canvas_right;
      $('#canvas_back,#canvas_left,#canvas_front').parent().hide();
      $('.back,.left,.front').hide();
      $('#canvas_right').parent().show();
      $('.right').show();
    break;
  }
}

function product(obj){
  $.each(step_obj,function(k,v){
    canvas_front.remove(v);
    canvas_back.remove(v);
    canvas_left.remove(v);
    canvas_right.remove(v);
  })
  step_obj = {};
  init(obj);
}



function logo(img){
  //退出染色模式
 $('.map div').css({'z-index':0});
  fabric.Image.fromURL(img, function(img) {
    img.set({
      left: 100,
      top: 150,
      angle: -15
    });
    img.scale(0.5);
    canvas_current.add(img);
    canvas_current.bringForward(img);
  });
}

function font(){
  var text = $('input[name="test"]').val();
  textSample = new fabric.Text(text, {
        left: 100,
        top: 20,
        fontFamily: 'Arcade',
        textAlign: 'left',
        angle: 0,
        fill: '#333333',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        fontSize: 40,
        originX: 'left',
        hasRotatingPoint: true,
        centerTransform: true
    });
    canvas_current.add(textSample);
}

var selectedObject;
function change_color(){
  canvas_current.on("object:selected", function () {
      selectedObject = canvas_current.getActiveObject();
      if (selectedObject.type === "text") {
          selectedObject.set("fill","#FF0000");
          canvas_current.renderAll();
      }else {
        var filter = new fabric.Image.filters.Tint({
          color: '#3513B0',
          opacity: 0.5
        });
        selectedObject.filters.push(filter);
        selectedObject.applyFilters(canvas_current.renderAll.bind(canvas_current));
      }
  });
}

$(document).ready(function () {
  canvas_front = new fabric.Canvas('canvas_front');
  canvas_back = new fabric.Canvas('canvas_back');
  canvas_left = new fabric.Canvas('canvas_left');
  canvas_right = new fabric.Canvas('canvas_right');
  //===一次初始化front，back，left，right四个方向数据
  init({'c':'tshirt','p':1});

  $('#colorpicker').colpick({
        onSubmit:function(hsb,hex,rgb,el,bySetColor) {
            $('.map div').css({'z-index':10});
            $(el).val('#'+hex);
            $(el).colpickHide();
        }
  });

  //===染色

  $(document).on('click','area',function(){
    var color = $('#colorpicker').val();
    if($(this).attr('data-color')){
      var choose = $(this).attr('data-color');
      if(color == choose){
        return false;
      }
      if(color == '#ffffff'){
        canvas_current.remove(step_obj[$(this).attr('name')]);
        return false;
      }
      canvas_current.remove(step_obj[$(this).attr('name')]);
    }else{
      if(color == '#ffffff'){
        return false;
      }
    }

    var coords_str = '';
    var strs = new Array();
    strs = $(this).attr("coords").split(",");
    var i1, i2;
    for (var i = 0; i < strs.length; i++) {
        if (i % 2 == 0) {
            i1 = strs[i];
        }
        if (i % 2 == 1) {
            i2 = strs[i];
            if (i == 1) {
                coords_str += 'M '+i1+' '+i2;
            }
            else {
                coords_str += ' L '+i1+' '+i2;
            }
        }
    }
    var path = new fabric.Path(coords_str);
    path.set({
      fill: color,
      opacity: 0.8,
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      hasControls: false,
      lockScaling: true,
      lockRotation: true
    });
    canvas_current.add(path);
    canvas_current.sendBackwards(path);
    step_obj[$(this).attr('name')] = path;
    $(this).attr('data-color',color);
    console.log(step_obj)
  })

});
