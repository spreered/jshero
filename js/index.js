class BaseCharacter {
  constructor(name,hp,ap){
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    console.log("create ap"+this.ap);
    this.alive = true;
  }
  attack(character, damage){  
    if(this.alive == false){
      return;
    } 
    character.getHurt(damage);
  }

  getHurt(damage){
    this.hp -= damage;
    console.log("getHurt::"+damage);
    if(this.hp <= 0){
      this.die();
    }

    var _this = this;
    var i = 1;

    // 設定受傷動畫
    _this.id = setInterval(function(){
      // 斬擊圖片 50ms , 從1~8
      _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      // 增加傷害點數及傷害動畫
      _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
      _this.element.getElementsByClassName("hurt-text")[0].innerHTML = damage;
      i++;
      if (i > 8) {
      //關閉斬擊動畫
      _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
      //關閉傷害點數及傷害動畫
      _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
      _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
      clearInterval(_this.id);
      }
    }, 50);
  }
  die(){
    this.alive = false;
  }
  updateHtml(hpElement, hurtElement) {
    //hpElement: 畫面上的hp文字數值  
    //hurtElement: 受傷值的白色block
    //更新hp和受傷block
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100) + "%"
  }
}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    //產生英雄後，綁定HTML中的元素
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("召喚英雄 " + this.name + "！");
  }
  attack(character) { 
    var damage = Math.random() * (this.ap/2) + (this.ap / 2);
    console.log("英雄攻擊："+damage);
    //攻擊對方 取整數
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage)
    //受到攻擊後更新自己的血值
    this.updateHtml(this.hpElement, this.hurtElement);
  }
  heal(plusHp){
    this.hp+=plusHp;

    //補血超過則滿血
    if(this.hp > this.maxHp){
      this.hp = this.maxHp;
    } 
    //更新html
    this.updateHtml(this.hpElement, this.hurtElement);

    var _this = this;
    var i = 1;

    // 設定補血動畫
    _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
    _this.element.getElementsByClassName("heal-text")[0].innerHTML = plusHp;

    _this.id= setInterval(function(){
      _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/'+ i +'.png';
      i++;
      if(i>8){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },60);
  }

}


class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    //產生Monster, 綁定HTML中的元素
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("怪物出現 " + this.name + "！");
  }
  attack(character) {
    var damage = Math.random() * (this.ap/2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage)
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

function addSkillEvent() {
  var skill = document.getElementById("skill");
  //攻擊按鈕
  skill.onclick = function() { 
    heroAttack(); 
    //點選攻擊按鈕後，進行攻擊，開始一回合
  }

  var heal = document.getElementById("heal");
  heal.onclick = function() {
    heroHeal();
    //點選治癒後，進行治癒，開始一回合
  }

}

function endTurn() {
  round--;  
  document.getElementById("round-num").textContent = round;
  if (round < 1) {
    finish();
  }
}


//攻擊流程開始
//global要先宣告hero 和monster
function heroAttack() {
  console.log(` hero hp: ${hero.hp}`);
  console.log(` monster hp: ${monster.hp}`);
 
  //這裡只會寫 移動的動畫(attacking)
  //斬擊動畫寫在getHurt()裡面


  //攻擊時，隱藏skill block
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  // -----Hero攻擊 start-----
  // 按鈕按下 [0.1s]後 => 
  //      移動200px(left:0 to left:200px) 0.5s
  //      [0.5s]後 =>
  //               hero.attack -> monster.getHurt 受傷以及斬擊動畫
  //               hero回到原位   (remove .attacking)

  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);
  // -----Hero攻擊 end-----

  setTimeout(function() {
    if (monster.alive){  //monster還沒死 就開始攻擊
      // -----Monster攻擊 start-----
      monster.element.classList.add("attacking")
      //加入開始攻擊動畫，往前移動 0.5s

      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        //monster攻擊事件完成，回合結束
        endTurn();
        //如果回合尚未結束，檢查hero是否gg
        if (hero.alive == false) {
          finish();
        } else {
          //回合結束後，顯示攻擊按鈕
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      //如果monster掛點，遊戲結束
      finish();
    }
  }, 1100);
  // -----Monster攻擊 end-----
}

function heroHeal(){
  // 1.英雄治癒
  //   [第 0.1s] 後開始
  //     治癒動畫 0.5s
  // 2.怪物攻擊 
  //   [第 0.7s] 後開始移動
  //     [0.5s] 後開始攻擊
  console.log("Hero healing!!");
  console.log(` hero hp: ${hero.hp}`);
  console.log(` monster hp: ${monster.hp}`);
  //治癒時，隱藏skill block
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  // -----Hero治癒 start-----
  setTimeout(function() {
    hero.heal(30); //呼叫治癒 增加30點hp
  }, 100);
  // -----Hero治癒 end-----

  // -----Monster攻擊 start-----
  setTimeout(function() {
    monster.element.classList.add("attacking");
    //加入開始攻擊動畫，往前移動 0.5s
    setTimeout(function() {
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      //monster攻擊事件完成，回合結束
      endTurn();
      //如果回合尚未結束，檢查hero是否gg
      if (hero.alive == false) {
        finish();
      } else {
        //回合結束後，顯示攻擊按鈕
        document.getElementsByClassName("skill-block")[0].style.display = "block";
      }
    }, 500);
  }, 700);

}






function finish() {
  var dialog = document.getElementById("dialog");
  //顯示結束的dialog
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

//綁定Skill的事件: 綁定hero攻擊鈕onclick，產生攻擊
addSkillEvent();
//設定攻擊回合數
var round = 10;


var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);

