import React, { Component, Fragment } from "react"
import _ from 'lodash'
import { Button, Grid, View, Content, Flex } from "@adobe/react-spectrum"

export default class Board extends Component {

    constructor(props) {
        super(props)
        this.moveUp = this.moveUp.bind(this)
        this.moveDown = this.moveDown.bind(this)
        this.moveLeft = this.moveLeft.bind(this)
        this.moveRight = this.moveRight.bind(this)
        this.size = 4

        let data = []
        for (let i = 0; i < this.size; i++) {
            data.push(new Array(this.size).fill(0))
        }

        this.state = {
            data: data
        }
    }

    moveUp(event) {
    }

    moveDown(event) {
    }

    moveLeft(event) {
    }

    moveRight(event) {
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
                    {_.map(this.state.data, row => {
                        { console.log("row", this.state.data) }
                        return <Fragment>
                            {_.map(row, (cell, idx) => {
                                return <View key={idx} backgroundColor="green-400" UNSAFE_style={{
                                    display: "flex",
                                    "align-items": "center",
                                    "justify-content": "center"
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
                        onClick={this.moveUp}>
                        UP
                    </Button>
                </div >
                <div className="button-container">
                    <Button
                        variant="cta"
                        onClick={this.moveLeft}>
                        LEFT
                    </Button>
                    <Button
                        variant="cta"
                        onClick={this.moveRight}>
                        RIGHT
                    </Button>
                </div>
                <div className="button-container">
                    <Button
                        variant="cta"
                        onClick={this.moveDown}>
                        DOWN
                    </Button>
                </div>
            </div>)

    }
}

