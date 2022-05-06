import React, { Component, Fragment } from "react"
import _ from 'lodash'
import { Button, Grid, View, Content } from "@adobe/react-spectrum"
import { Game } from "./game"
import { Direction } from "./events"

export default class Board extends Component {
    game

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
        this.game.queueAction({
            type: "START"
          });
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
                    columns={['size-800', 'size-800', 'size-800', 'size-800']}
                    // autoColumns="size-800"
                    autoRows="size-800"
                    justifyContent="center"
                    gap="size-100">
                    {_.map(this.state.data, (row, rowIdx) => {
                        return <Fragment key={rowIdx}>
                            {_.map(row, (cell, idx) => {
                                return <View  key={rowIdx+"_"+ idx} backgroundColor="green-400" UNSAFE_style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }} >
                                    <Content>{cell}</Content>
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

