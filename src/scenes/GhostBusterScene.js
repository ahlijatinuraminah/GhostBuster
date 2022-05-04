import Phaser from 'phaser'
import Bomb from '../ui/Bomb.js'  //int2 p.24
import Ghost from '../ui/Ghost.js' // int 2 p.13
import ScoreLabel from '../ui/ScoreLabel.js' // Int 2 p.33

export default class GhostBusterScene extends Phaser.Scene
{
    constructor() {
        super('ghost-buster-scene')
    }

    init(){
        this.ground = undefined
        this.bombs = undefined
        this.lastFired = 0        
        this.cursor =  undefined//Int 1 p.289
        this.ghosts = undefined
        this.ghostSpeed = 60
        this.scoreLabel = undefined // Int 2 p.33

    }

    preload() {
        this.load.image('background', 'images/background.png')    
        this.load.image('ghost', 'images/ghost.png')
        this.load.image('ground', 'images/ground.png')
        this.load.spritesheet('player', 'images/player.png', {frameWidth:32, frameHeight:32}) //p.247
        this.load.spritesheet('bombs', 'images/bomb.png', {frameWidth: 31, frameHeight:32}) //int 2 p.25

    }

    create() {
        const gameWidth = this.scale.width * 0.5
        const gameHeight = this.scale.height * 0.5
        this.add.image(gameWidth, gameHeight,'background')
        this.ground = this.physics.add.staticGroup() //collecting star p.251
        this.ground.create(gameWidth, 490, 'ground')

        this.player = this.physics.add.sprite(240, 320, 'player')
        this.physics.add.collider(this.player, this.ground) //p.283
        this.cursor = this.input.keyboard.createCursorKeys() //Int 1 p.289
        
        this.bombs = this.physics.add.group({ // Int 2 p.25
            classType : Bomb,
            maxSize : 1,
            runChildUpdate: true
        })

        this.ghosts = this.physics.add.group({ // Int 2 p.15
            classType : Ghost,
            maxSize : 10,
            runChildUpdate : true
        })

        this.time.addEvent({ //Int 2 p.16
            delay: 2000,
            callback: this.spawnGhost,
            callbackScope: this,
            loop: true
        })

        this.physics.add.overlap(this.bombs, this.ghosts, this.hitGhost, null, this) //Int 2 p.26
        this.scoreLabel = this.createScoreLabel(16, 16, 0) // Int 2 p.35

        this.physics.add.overlap(this.player, this.ghosts, this.gameOver, null, this) //Int 2 p.26
    }

    update(){
        this.movePlayer(this.player)
    }

    movePlayer(player, time) { //Int 2 p.5
        if (this.cursor.left.isDown){ ////Int 1 p.289
            this.player.setVelocityX(-200)
        } else if (this.cursor.right.isDown){
            this.player.setVelocityX(200)            
        } else {
            this.player.setVelocityX(0)            
        }

        if (this.cursor.space.isDown){
            const bomb = this.bombs.get(0, 0, 'bombs')
            if(bomb){
                bomb.fire(this.player.x, this.player.y)
                this.lastFired = time + 150
            }
        }
    }

    spawnGhost() { //Int 2 p.14
        
        const config = {
            speed : this.ghostSpeed,
            rotation : 0.06
        }
        
        // @ts-ignore
        const ghost = this.ghosts.get(0, 0, 'ghost', config)
        const enemyWidth = ghost.displayWidth
        const positionX = Phaser.Math.Between(enemyWidth, this.scale.width - enemyWidth)
        if (ghost) {
            ghost.spawn(positionX)
        }
    }

    hitGhost(bomb, ghost) { // Int 2 p27

        bomb.erase() //destroy laser yg bersentuhan
        ghost.die() //destroy enemy yg 
        
        this.scoreLabel.add(10) // Int 2 p.36
    }

    createScoreLabel(x, y, score){ //Int 2 p.34
        const style = { fontSize: '32px', fill: '#000'}
        const label = new ScoreLabel(this, x, y, score, style).setDepth(1)
        this.add.existing(label)
        return label
    }

    gameOver() {
        this.scene.start('game-over-scene', { score: this.scoreLabel.getScore() })
    }

}
