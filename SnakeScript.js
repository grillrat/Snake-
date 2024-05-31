/*
Alice Lee, PD 7 (2/23/22)
“On my honor as a student, I have neither given nor received any unauthorized aid on this assignment.”
*/

const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');

let width=canvas.width;
let height=canvas.height;

let blockSize=10;
let widthInBlocks=width/blockSize;
let heightInBlocks=height/blockSize;
let score = 0;  //create a score var...

let Block=function(col,row){    //give position to block // "Block" is a name that refers to object
    this.col=col;
    this.row=row;
}

Block.prototype.equal=function(otherBlock){  //where is otherBlock? Are two blocks = / in same location?
    return this.row===otherBlock.row&&this.col===otherBlock.col;
}

Block.prototype.drawSquare=function(color){ //draw apples
    let x=this.col*blockSize;
    let y=this.row*blockSize;   //x is larger, makes it easier to increment
    ctx.fillStyle=color;    //this is the function
    ctx.fillRect(x,y,blockSize,blockSize);  //position, blockSize=how to tall it is
    //blocks have ability to draw squares (apples)
}
let redBlock=new Block(6,7);
let blueBlock=new Block(27,29);

redBlock.drawSquare("red");
blueBlock.drawSquare("blue");

function circle(x,y,radius){
    ctx.beginPath();    //must begin pathway first
    ctx.arc(x,y,radius,0,Math.PI*2);    //Full circle = 2pi
    ctx.fillStyle="purple";   //do anywhere before .fill
    ctx.fill();
}

Block.prototype.drawCircle=function(color){
    let centerX=this.col*blockSize+blockSize/2;
    let centerY=this.row*blockSize+blockSize/2;
    ctx.fillStyle=color;
    circle(centerX,centerY,blockSize/2);
};
circle(100,100,25);

let Snake=function(){   //small blocks make up whole snake, will change after eating
    this.segments=[
        new Block(7,5),  //column, row - specified earlier, at index 0
        new Block(6,5),
        new Block(5,5)
    ];
    this.direction='right'; //MODIFIED LATER
    this.nextDirection='right';
};

const directions={   //object
    Space:"stop",   //buttons return ""
    ArrowLeft:"left",
    ArrowUp:"up",
    ArrowRight:"right",
    ArrowDown:"down"
}

$('body').keydown(function(event){     //register an event when keydown
    let newDirection=directions[event.code]; //access object properties using array notation. Allows variability to access properties you don't know
    if(newDirection!==undefined){
        snake.setDirection(newDirection);
    }
});

//write setDirection with Snake material: changes this.nextDirection to newDirection
    //else if right && left --> will run into itself if true, so make it illegal. 4 combinations
Snake.prototype.setDirection=function(newDirection){
    if(this.direction==="up"&&newDirection==="down"){
        return;
    }
    else    
        if(this.direction==="right"&&newDirection==="left"){
            return;
        }
        else
            if(this.direction==="down"&&newDirection==="up"){
            return;
            }
            else
                if(this.direction==="left"&&newDirection==="right"){
                    return;
                }    
    this.nextDirection=newDirection;    //gives snake new direction
}

Snake.prototype.draw=function(){    //draw is a property, not fxn, no ()
    for(let i=0;i<this.segments.length;i++){
        this.segments[i].drawSquare('blue');
    }
};

Snake.prototype.move=function(){    //put a new head above, in front, or below
    let head=this.segments[0];
    let newHead;    //where you put new block. Add block to front, take one from back. Don't take if eaten.
    this.direction=this.nextDirection;  //direction = keyboard. nextDirection will become current direciton, etc.

    if(this.direction==="right"){
        newHead=new Block(head.col+1,head.row); //new head inc horizontally
    }else 
        if(this.direction==="down"){
            newHead=new Block(head.col,head.row+1);  //y+1 = down
        }else 
            if(this.direction==="left"){
                newHead=new Block(head.col-1,head.row);
            }else 
                if(this.direction==="up"){
                    newHead=new Block(head.col,head.row-1); //-1 = up on y
                }

    if(this.checkCollision(newHead)){
        gameOver();
        return;
    }
    this.segments.unshift(newHead); //segments = []. unshift puts new element at start of array

    if(newHead.equal(apple.position)){   //don't delete back if eaten
        score++;
        console.log(score)
        apple.move();
    }else{
        this.segments.pop()
    }    
}   //end Snake move

function drawScore(){
    let scoreValue=$("#scoreValue");  //select score with jQuery, update score with .text, must put arg to replace OG
    scoreValue.text(score);  //fill in ""
}

function drawBorder(){  //four borders on screen. When does snake hit border? Apples can't be in border.
    //first column is 0 --> 400 px (blocksize is 10), 40-1 = 39 columns
    //first row = 0, 39
    ctx.fillRect(0,0,width,blockSize);
    ctx.fillRect(0,0,blockSize,height);
    ctx.fillRect(width-blockSize,0,blockSize,height);
    ctx.fillRect(0,height-blockSize,width,blockSize);
}

let snake=new Snake();  

//is head of snake runningn into anything?
Snake.prototype.checkCollision=function(head){  //give it a block and evaluate if collision t/f    
    let leftCollision=head.col===0; //use this!!
    let topCollision=head.row===0; 
    let rightCollision=head.col===widthInBlocks-1; 
    let bottomCollision=head.row===heightInBlocks-1;
    //If Game Over on screen before play: set wallCollision as false (which it will never be) to check if
    //there's a problem with selfCollision
    let wallCollision=leftCollision||topCollision||rightCollision||bottomCollision; 
    
    //check selfCollision w/ flag var
    let selfCollision=false;
    for(let i=0;i<this.segments.length;i++){
        if(head.equal(this.segments[i])){   //if head is equal to spot of other piece, true. Checks all pieces
            selfCollision=true; 
        }
    }
    return wallCollision||selfCollision;
};  //end checkCollision

function gameOver(){ //textAlign gets things in middle, Baseline is equal space in front and back of text
    clearInterval(intervalID);
    ctx.font="60px 'Comic sans MS'";
    ctx.fillStyle="red";
    ctx.textAlign="center";
    ctx.textBaseline='middle';
    ctx.fillText("Game Over",width/2,height/2)
 };

let Apple=function(){
    //position is  block, which means it has rows and columns
    this.position=new Block(10,10);
}

Apple.prototype.draw=function(){
    this.position.drawCircle("red");    //this.position is a block
};

Apple.prototype.move=function(){
    //random row and column between 1 and 38
    //this.position will become new block at new position
    let randomCol=Math.floor(Math.random()*38+1);
    let randomRow=Math.floor(Math.random()*38+1);
    this.position=new Block(randomCol,randomRow);
};

let apple=new Apple();

//intervalID specifies # of times looped. 
//clearInterval fxn: must know # of intrvl from setInterval, stops snake 
//clearInterval(intervalID); --> in gameOver function
let intervalID
function play(){   
    intervalID=setInterval(function(){  //loops inside code based on TIME, setInt gives # to intervalID. 
        //intervalID specifies # of times looped. clearInterval fxn: must know # of intrvl from setInterval, stops snake 
        ctx.clearRect(0,0,width,height);
        drawScore();    //every time you eat apple, score should +1. Grab scoreValue id from html w/ jQuery to make html show score
        snake.move();
        snake.draw();
        drawBorder();
        apple.draw();
    },200); //every second, code loops 5 times
}

function replay(){
    clearInterval(intervalID);  //must clear interval bc call play again
    score=0;
    snake=new Snake();  //do not use let snake=... bc that is local var that play() can't use
    apple=new Apple();
    play();
}
