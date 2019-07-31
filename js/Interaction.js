var Interaction = function ()
{
    this.currentFloor = "floor1";
    this.whetherrotate = false;
}
//交互部分
Interaction.prototype.fuc1 = function (_this)
{
    document.getElementById('escapeDoor1').addEventListener('click',function (event) {
        _this.camera.position.set(400,80,70);
        _this.freeViewControl.center.set(416,22,7);
    });
    document.getElementById('escapeDoor2').addEventListener('click',function (event) {
        _this.camera.position.set(500,60,53);
        _this.freeViewControl.center.set(554,22,46);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (event) {
        _this.camera.position.set(540,60,-32);
        _this.freeViewControl.center.set(548,22,6);
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        _this.freeViewControl.autoRotate=false;
    });
    document.getElementById('floor1').addEventListener('click',function(event)
    {
        _this.camera.position.set(397,29,42);
    });
    document.getElementById('floor2').addEventListener('click',function(event)
    {
        _this.camera.position.set(589,14,18);
    });

}

Interaction.prototype.fuc2 = function (_this)
{
    var self = this;
    document.getElementById('startRun').addEventListener('click',function (event)
    {

        document.getElementById("fireman").style.display = "inline-block";
        document.getElementById("floor1").style.display = "inline-block";
        document.getElementById("floor2").style.display = "inline-block";
        document.getElementById("startRun").style.display = "none";
        document.getElementById("transformSmoke").style.display = "none";

        _this.smoke.redBallMesh.position.x=_this.smoke.positionBallMesh.position.x+16;
        _this.smoke.redBallMesh.position.z= _this.smoke.positionBallMesh.position.z;
        _this.smoke.positionBallMesh.visible=false;
        _this.isStartRun = true;
        _this.smoke.isStartSmoke = true;
        _this.clock=new THREE.Clock();
        /*
        let timeEscape = setInterval(function ()
        {
            if(meshTotalCount>=5){
                currentEscapeTime += 1;
                document.getElementById('escapeTimePanel').innerHTML = '逃生用时：'+ currentEscapeTime +' s';
            }else{
                clearInterval(timeEscape);
            }
        },1000);
        */
        _this.smoke.pp.set(_this.smoke.positionBallMesh.position.x,_this.smoke.positionBallMesh.position.y,_this.smoke.positionBallMesh.position.z);
        if( _this.smoke.pp.x+18>215)
        {
            self.whetherrotate=true;
        }
        _this.smoke.newsmokeData=smoke_insert(_this.smoke.p0,_this.smoke.p1,_this.smoke.p2,_this.smoke.pp,_this.messagecontrol.smokeDataA,_this.messagecontrol.smokeDataB,_this.messagecontrol.smokeDataC);
        //开始模拟后开始行走
        for(var i=0; i<_this.people.blendMeshArr.length;i++) {
            var meshMixer = new THREE.AnimationMixer( _this.people.blendMeshArr[i] );
            _this.people.walkAction = meshMixer.clipAction( 'walk' );
            _this.people.runAction=meshMixer.clipAction('run');
            //actions = [ walkAction, idleAction, runAction ];
            _this.people.actions = [_this.people.walkAction, _this.people.runAction];
            _this.people.activateAllActions1(_this.people.actions);
            _this.people.mixerArr.push(meshMixer);
        }
        for(var iL=0; iL<_this.people.leaderMeshArr.length;iL++) {
            var meshMixer = new THREE.AnimationMixer( _this.people.leaderMeshArr[iL] );
            _this.people.walkAction = meshMixer.clipAction( 'walk' );
            _this.people.runAction=meshMixer.clipAction('run');
            //actions = [ walkAction, idleAction, runAction ];
            _this.people.actions = [_this.people.walkAction, _this.people.runAction];
            _this.people.activateAllActions1(_this.people.actions);
            _this.people.mixerArr.push(meshMixer);
        }

    });


}

Interaction.prototype.fuc3 = function (MainScene)
{
    var $ = function(_) {
        return document.getElementById(_);
    };

    $('createPersonBtn').addEventListener('click',function (event)
    {
        $('loading').style.display = 'block';
        $('createPerson').style.display = 'none';
        $('escapedoor-menu').style.display = 'none';
        $('Menu').style.display = 'block';
        $('floor-menu').style.display = 'block';


        var number=Number($('people-number').textContent);
        MainScene.number=number;
        Utils.loading(1000);
        MainScene.Path.createNav();
        MainScene.addPeople();

    });

    $('fireman').addEventListener('click',function (event)
    {
        MainScene.isfiremanclick=true;
        MainScene.camControlOver.autoRotate = false;

            $("fireman").style.display="none";

            //消防员出现之后就是跟随视角
            $("floor1").style.display="none";
            $("floor2").style.display="none";
            $("cancelFollow").style.display="inline-block";
            $("allowFollow").style.display="none";
            $("startRun").style.display="none";
            $('OrbitView').click();
            $('floor-menu').style.display="none";

    });

    $('floor1').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(397,29,42);
        MainScene.camControl.lon = 337;
        MainScene.camControl.lat = -30;
        MainScene.currentFloor = "floor1";
    });

    $('floor2').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(589,14,18);
        MainScene.camControl.lon = 160;
        MainScene.camControl.lat = -30;
        MainScene.currentFloor = "floor2";
    });

    $('transformSmoke').addEventListener('click',function(event)
    {
        if(!MainScene.isEdit){
           // userBookNumber=1;
            $("startRun").style.display="none";
            $("floor1").style.display = "none";
            $("floor2").style.display = "none";
            $("toNo1").style.display = "inline-block";
            $("toNo2").style.display = "inline-block";
            $("toNo3").style.display = "inline-block";
            $("toNo4").style.display = "inline-block";
            $("toNo5").style.display = "inline-block";
            $('transformSmoke').textContent="返回";

            MainScene.smoke.Logo1Material.visible=true;
            MainScene.smoke.Logo2Material.visible=true;
            MainScene.smoke.Logo3Material.visible=true;
            MainScene.smoke.Logo4Material.visible=true;
            MainScene.smoke.Logo5Material.visible=true;
            MainScene.camera.position.set(150,195, 60)
            MainScene.camera.lookAt(150, 0, 8);
            MainScene.globalPlane.constant = 17;
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
            MainScene.control.attach(MainScene.smoke.positionBallMesh);
            MainScene.isEdit = true;
            MainScene.control.visible = true;
            MainScene.fire.Te1Material.visible=false;
            MainScene.fire.Te2Material.visible=false;
            MainScene.smoke.positionBallMesh.visible=true;

        } else{
           // userBookNumber=0;
            $("startRun").style.display="inline-block";
            $("floor1").style.display="inline-block";
            $("floor2").style.display="inline-block";
            $("toNo1").style.display = "none";
            $("toNo2").style.display = "none";
            $("toNo3").style.display = "none";
            $("toNo4").style.display = "none";
            $("toNo5").style.display = "none";
            $('transformSmoke').textContent="编辑烟雾";

            MainScene.smoke.Logo1Material.visible=false;
            MainScene.smoke.Logo2Material.visible=false;
            MainScene.smoke.Logo3Material.visible=false;
            MainScene.smoke.Logo4Material.visible=false;
            MainScene.smoke.Logo5Material.visible=false;
            MainScene.camera.position.set(573,53,69);
            MainScene.camControl.lon = -140;
            MainScene.camControl.lat = -90;
            MainScene.globalPlane.constant=100000;
            MainScene.control.attach();
            MainScene.isEdit = false;
            MainScene.control.visible = false;
            MainScene.fire.Te1Material.visible=false;
            MainScene.fire.Te2Material.visible=false;
            MainScene.smoke.positionBallMesh.visible=false;

        }
    });
    $('cancelFollow').addEventListener('click',function (event) {
        MainScene.isOverView = false;
    });

    $('toNo1').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=41;
        MainScene.smoke.positionBallMesh.position.z=25;

    });
    $('toNo2').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=91;
        MainScene.smoke.positionBallMesh.position.z=25;
    });
    $('toNo3').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=151;
        MainScene.smoke.positionBallMesh.position.z=20;
    });
    $('toNo4').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=180;
        MainScene.smoke.positionBallMesh.position.z=22;
    });
    $('toNo5').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=215;
        MainScene.smoke.positionBallMesh.position.z=27;
    });

    $('OrbitView').addEventListener('change',function () {
        MainScene.isOverView = true;
    });
    $('freeView').addEventListener('change',function () {
        MainScene.isOverView = false;
    });
}
