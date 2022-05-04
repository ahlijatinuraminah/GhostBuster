import Phaser from 'phaser'

var replayButton

export default class GameOverScene extends Phaser.Scene
{
    constructor()
    {
        super('game-over-scene')
    }
    //ni belum
    init(data) 
    {
        this.score = data.score
    }

    preload()
    {
        this.load.image('backgrounds', 'images/background.png')    
        this.load.image('gameovers', 'images/gameover.png')
        this.load.image('replay', 'images/replay.png')
    }

    create()
    {
        const gameWidth = this.scale.width * 0.5
        const gameHeight = this.scale.height * 0.5
        this.add.image(gameWidth, gameHeight,'backgrounds')
        this.add.image(200, 200, 'gameovers')
        
        this.replayButton = this.add.image(200, 450, 'replay').setInteractive()
        this.replayButton.once('pointerup', () => { this.scene.start('ghost-buster-scene') }, this)

        //belakangan
        this.add.text(80, 300, 'SCORE:', { fontSize: '60px', fill: '#000' })
        this.add.text(300, 300, this.score, { fontSize: '60px', fill: '#000'})
        
    }
}