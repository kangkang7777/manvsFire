var mainScene = function()
{
    this.stats = initStats();
    function initStats() {
        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms
        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }
    clock = new THREE.Clock();

    this.scene = new THREE.Scene();

    clock.start();

    this.number = 100;//人数

    this.camera = null;

    this.camDirection;

    this.renderer = null;//渲染器

    this.clock = new THREE.Clock();

    this.freeViewControl = null;     //自由观察视角

    this.camControl = null;

    this.isACO = true;  //是否进行默认的蚁群算法

    this.isOverView = true; //初始时观察整个地铁站时用这个

    this.isStartRun = false; //是否开始？

    this.active = true;    //暂停

    this.underground = new Underground();//场景

    this.people = new People();//人群

    this.Path = new path();

    this.smoke = new Smoke();//烟

    this.messagecontrol = new messageControl();//控制子线程传输

    this.fire = new fireControl();//火

    this.water = new waterControl();//水

    this.Fireman = new fireman();//消防员&灭火

    this.HCI = new Interaction();//交互控制

    this.globalPlane = null;


    //控制参数

    this.isEdit = false;

    this.mouse=new THREE.Vector2();


    this.isFinishLoadCharactor = false;


    this.step = new Array(10);
    this.step.fill(0);

    this.count = new Array(10);
    this.count.fill(0);

    this.messagecontrol.START();

}

mainScene.prototype.init = function()
{
    //初始化
    this.setScene();

    //region 路径
    this.Path.init(this);
    //endregion

    //region 水
    this.water.init(this);
    //endregion

    //region 烟雾
    this.smoke.init(this);
    //endregion

    //region 火
    this.fire.init(this);
    //endregion

    //region场景加载
    this.underground.init(this.scene,this.renderer);
    //endregion

    //regiog消防员加载
    this.Fireman.init(this);
    //endregion

    //交互1
    this.HCI.fuc1(this);

    //交互2
    this.HCI.fuc2(this);

}

mainScene.prototype.start = function()
{
    var self = this;
    this.clock.start();  //todo maybe stop

    //self.Path.createNav();
        animate();

    function animate()
    {
        self.delta = self.clock.getDelta();

        self.water.update();    //todo debug here

        self.fire.update(self);

        self.smoke.update(self);

        self.Fireman.update(self);

        self.people.update(self);

        TWEEN.update();

        self.stats.update();

        if(self.active) requestAnimationFrame(animate);
        self.renderer.clear();
        self.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        self.renderer.render(self.scene, self.camera);
        //todo self.renderer.clear();    与renderer.autoClear = false 对应 不知道意义何在
        self.stats.end();

        //self.LOD;//lod算法

    }

}

mainScene.prototype.setScene = function()
{
    //region 基础场景
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000);
    this.camera.position.set(639,160,106);
    this.camera.lookAt(200,0,25);

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.autoClear = true;    //todo 不声明的话默认为true,原demo为false, 与start.animate 中renderer.clear()对应
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xbbd0d9 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

    this.camControlOver = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.camControlOver.center = new THREE.Vector3(430,24,21);
    this.camControlOver.userPan = false;
    this.camControlOver.autoRotate=true;
    this.freeViewControl = this.camControlOver;

    var camControl = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
    camControl.lookSpeed = 1;
    camControl.movementSpeed = 2 * 10;
    camControl.noFly = true;
    camControl.lookVertical = true;
    camControl.constrainVertical = true;
    camControl.verticalMin = 1.0;
    camControl.verticalMax = 2.0;
    camControl.lon =-138;
    camControl.lat =-90;
    this.camControl = camControl;


    var ambientLight = new THREE.AmbientLight(0xcccccc);
    this.scene.add(ambientLight);

    var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_1.position.set(0.3,0.4,0.5);
    this.scene.add(directionalLight_1);

    var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.2);
    directionalLight_2.position.set(-0.3,-0.4,0.5);
    this.scene.add(directionalLight_2);
//endregion

    //region 物体操作工具
    this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
    this.control.attach( );
    this.scene.add( this.control );
    this.control.visible = false;

    this.extinguisherControl=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl.attach();
    this.scene.add(this.extinguisherControl);
    this.extinguisherControl.visible=false;
//endregion

    this.globalPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.1 );
    this.globalPlane.constant =10000;//剖切的位置
    this.renderer.clippingPlanes.push(this.globalPlane);
    this.renderer.localClippingEnabled = true;
}

mainScene.prototype.addPeople = function ()
{
    this.people.init(this);
}

mainScene.prototype.LOD = function ()
{
    var self = this;
    //LOD算法，根据视距进行模型的显示和隐藏
    self.camDirection = self.camera.position.clone();
    var isCamUp = self.camera.position.y>18; //如果摄像机在第二层，将此变量设置成true
    for(var key in self.people.pathControlMap){

        if(self.people.pathControlMap[key].prototype === THREE.FollowerControl.prototype){
            if(Math.abs(self.people.pathControlMap[key].object.position.x-self.camDirection.x)+
                Math.abs(self.people.pathControlMap[key].object.position.y-self.camDirection.y)+
                Math.abs(self.people.pathControlMap[key].object.position.z-self.camDirection.z) > 100){

                self.people.pathControlMap[key].object.visible = false;
                if(self.people.pathControlMap[key].lod_low_level_obj){
                    if((isCamUp && self.people.pathControlMap[key].object.position.y>18)||(!isCamUp && self.people.pathControlMap[key].object.position.y<18)){
                        self.people.pathControlMap[key].lod_low_level_obj.visible = true;
                    }else{
                        self.people.pathControlMap[key].lod_low_level_obj.visible = false;
                    }
                }
            }else{
                if((isCamUp && self.people.pathControlMap[key].object.position.y>18)||(!isCamUp && self.people.pathControlMap[key].object.position.y<18)){
                    self.people.pathControlMap[key].object.visible = true;
                }else{
                    self.people.pathControlMap[key].object.visible = false;
                }
                if(self.people.pathControlMap[key].lod_low_level_obj) self.people.pathControlMap[key].lod_low_level_obj.visible = false;
            }
        }

    }
}
