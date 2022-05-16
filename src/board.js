import React, { Component, Fragment } from "react"
import _ from 'lodash'
import { Button, Grid, View, Content } from "@adobe/react-spectrum"
import { Game } from "./game"
import { Direction } from "./events"

export default class Board extends Component {
    game

    static COLORMAP = {
        0:{
            backgroundColor: "#cfc6bc",
            textColor: "#5c5956"
        },
        2:{
            backgroundColor: "#eee4da",
            textColor: "#776e65"
        },
        4:{
            backgroundColor: "#eee1c9",
            textColor: "#776e65"
        },
        8:{
            backgroundColor: "#f3b27a",
            textColor: "#f9f6f2"
        },
        16:{
            backgroundColor: "#f69664",
            textColor: "#f9f6f2"
        },
        32:{
            backgroundColor: "#f77c5f",
            textColor: "#f9f6f2"
        },
        64:{
            backgroundColor: "#f75f3b",
            textColor: "#f9f6f2"
        },
        128:{
            backgroundColor: "#edd073",
            textColor: "#f9f6f2"
        },
        256:{
            backgroundColor: "#edcc62",
            textColor: "#f9f6f2"
        },
        512:{
            backgroundColor: "#d4f553",
            textColor: "#f9f6f2"
        },
        1024:{
            backgroundColor: "8ced97",
            textColor: "#f9f6f2"
        },
        2048:{
            backgroundColor: "green",
            textColor: "#f9f6f2"
        },
    }

    constructor(props) {
        super(props)
        this.moveUp = this.moveUp.bind(this)
        this.moveDown = this.moveDown.bind(this)
        this.moveLeft = this.moveLeft.bind(this)
        this.moveRight = this.moveRight.bind(this)
        this.reset = this.reset.bind(this)
        this.size = 4
        this.game = new Game(this.size)

        this.state = {
            data: this.game.grid.data
        }

    }

    async componentDidMount(){
        document.addEventListener('keydown', (e)=>{
            switch (e.keyCode) {
                case 37:
                    this.moveLeft(e)
                    break;
                case 38:
                    this.moveUp(e)
                    break;
                case 39:
                    this.moveRight(e)
                    break;
                case 40:
                    this.moveDown(e)
                    break;
            }
        })

        this.game.queueAction({
            type: "START"
          })
        while(true){
            await this.game.run()
            this.setState({data: this.game.grid.data}, ()=>{
                if(this.state.data[this.size-1][0]==2048){
                    this.props.showDialog(true, "You Won!!! Restarting Game...")
                    this.reset()
                }
            })
        }
    }

    moveUp(event) {
        this.game.queueAction({
            type: "MOVE",
            direction: Direction.Up
        })
    }

    moveDown(event) {
        this.game.queueAction({
            type: "MOVE",
            direction: Direction.Down
        })
    }

    moveLeft(event) {
        this.game.queueAction({
            type: "MOVE",
            direction: Direction.Left
        })
    }

    moveRight(event) {
        this.game.queueAction({
            type: "MOVE",
            direction: Direction.Right
        })
    }

    reset(){
        this.game.queueAction({
            type: "START"
          })
    }

    render() {
        return (
            <div>
                <div>Board</div>
                <Grid
                    UNSAFE_className="grid-2048"
                    columns={['size-1200', 'size-1200', 'size-1200', 'size-1200']}
                    // autoColumns="size-1200"
                    autoRows="size-1200"
                    justifyContent="center"
                    gap="size-0">
                    {_.map(this.state.data, (row, rowIdx) => {
                        return <Fragment key={rowIdx}>
                            {_.map(row, (cell, idx) => {
                                return <View  key={rowIdx+"_"+ idx} UNSAFE_style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "4px solid #bbada0",
                                    background: this.game.latestTile && this.game.latestTile.rowIndex == rowIdx && this.game.latestTile.colIndex == idx? "#dbe67c": Board.COLORMAP[cell].backgroundColor,
                                    borderRadius: "0.5rem"
                                }} >
                                    <Content UNSAFE_className="cell-value" UNSAFE_style={{
                                        color: Board.COLORMAP[cell].textColor
                                    }} >{cell}</Content>
                                </View>
                            })}
                        </Fragment>
                    }
                    )}

                </Grid>
                <div className="button-container">
                    <Button
                        variant="cta"
                        onPress={this.moveUp}>
                        UP
                    </Button>
                </div >
                <div className="button-container">
                    <Button
                        variant="cta"
                        onPress={this.moveLeft}>
                        LEFT
                    </Button>
                    <Button
                        variant="cta"
                        onPress={this.moveRight}>
                        RIGHT
                    </Button>
                </div>
                <div className="button-container">
                    <Button
                        variant="cta"
                        onPress={this.moveDown}>
                        DOWN
                    </Button>
                </div>

                <div className="button-container">
                    <Button
                        variant="negative"
                        onPress={this.reset}>
                        Reset
                    </Button>
                </div>
            </div>)

    }
}

