import React from 'react';
import './App.css';
import models from './models/sudoku'
import sudoku from 'sudoku-umd'

class App extends React.Component {

  constructor(props) {
    super(props)
    let generatedSudoku = sudoku.generate("easy", false)
    let copy = sudoku.solve(generatedSudoku)
    this.state = {
      schema: generatedSudoku,
      fields: sudoku.board_string_to_grid(generatedSudoku),
      isCheckSolution: false,
      isSolve: false,
      isCorrect: false
    }
  }

  newGame = () => {
    let generatedSudoku = sudoku.generate("easy", false)
    this.setState({
      schema: generatedSudoku,
      fields: sudoku.board_string_to_grid(generatedSudoku),
      isSolve: false
    })
  }

  restart = () => {
    this.setState({
      fields: sudoku.board_string_to_grid(this.state.schema)
    })
  }

  solve = () => {
    let correct = sudoku.solve(this.state.schema),
      fields = this.state.fields,
      inCorrect = []
    correct = sudoku.board_string_to_grid(correct)
    for (let i = 0; i < fields.length; i++) {
      for (let k = 0; k < fields[i].length; k++) {
        if (fields[i][k] != correct[i][k]) {
          inCorrect.push({
            i, k
          })
        }
      }
    }
    this.setState({
      isSolve: true,
      inCorrect
    })
  }

  checkSolution = () => {
    let correct = sudoku.solve(this.state.schema),
      fields = this.state.fields,
      inCorrect = []
    correct = sudoku.board_string_to_grid(correct)
    for (let i = 0; i < fields.length; i++) {
      for (let k = 0; k < fields[i].length; k++) {
        if (fields[i][k] != correct[i][k]) {
          inCorrect.push({
            i, k
          })
        }
      }
    }
    this.setState({
      isCheckSolution: true,
      isCorrect: inCorrect.length == 0 ? true : false
    })
  }

  createTable = () => {
    let table = [],
      setup = this.state.fields,
      schema = sudoku.board_string_to_grid(this.state.schema)
    for (let i = 0; i < 9; i++) {
      let row = [],
        currentRow = setup[i]
      for (let k = 0; k < 9; k++) {
        let currentCol = currentRow[k]
        let rest = {}
        if (k % 3 == 0) {
          rest = {
            style: {
              marginLeft: 20
            }
          }
        }
        if (this.state.isSolve) {
          let isError = false
          for (let m = 0; m < this.state.inCorrect.length; m++) {
            if (this.state.inCorrect[m].i == i && this.state.inCorrect[m].k == k) {
              isError = true
            }
          }

          row.push(
            <div key={k} className="col" {...rest}>
              {
                isError ?
                  <input value={setup[i][k] == "." ? "" : setup[i][k]} disabled style={{ background: "red" }} /> :
                  <React.Fragment>
                    {
                      setup[i][k] == "." ?
                        <input value={""} disabled /> :
                        <input value={setup[i][k]} disabled />
                    }
                  </React.Fragment>
              }
            </div>
          )
        } else {
          row.push(
            <div key={k} className="col" {...rest}>
              {
                schema[i][k] != "." ?
                  <input value={schema[i][k]} disabled /> :
                  currentCol != "." ?
                    <input value={currentCol} onChange={this.handleChange(i, k)} onKeyDown={this.onKeyDown} /> :
                    <input value={""} onChange={this.handleChange(i, k)} onKeyDown={this.onKeyDown} />
              }
            </div>
          )
        }
      }
      if (i % 3 == 0 && i != 0) {
        table.push(<div key={i} className="row" style={{ marginTop: 20 }}>{row}</div>)
      } else {
        table.push(<div key={i} className="row">{row}</div>)
      }

    }
    return table
  }

  onKeyDown = (e) => {
    let allowKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8]
    if (!allowKeys.includes(e.which)) {
      e.preventDefault()
    }
  }

  handleChange = (row, col) => {
    return (e) => {
      let value = e.target.value
      if (value > 0 && value < 10) {
        let setup = this.state.fields
        for (let i = 0; i < 9; i++) {
          if (row == i) {
            for (let k = 0; k < 9; k++) {
              if (col == k) {
                setup[i][k] = e.target.value
              }
            }
          }
        }
        this.setState({
          fields: setup
        })
      } else {
        let setup = this.state.fields
        for (let i = 0; i < 9; i++) {
          if (row == i) {
            for (let k = 0; k < 9; k++) {
              if (col == k) {
                setup[i][k] = ""
              }
            }
          }
        }
        this.setState({
          fields: setup
        })
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="table ">
          {this.createTable()}
        </div>
        <br />
        <button onClick={this.newGame}>New Game</button>
        <button onClick={this.restart} disabled={this.state.isSolve ? true : false}>Restart</button>
        <button onClick={this.solve} disabled={this.state.isSolve ? true : false}>Solve</button>
        <button onClick={this.checkSolution} disabled={this.state.isSolve ? true : false}>Check Soluton</button>
        {
          this.state.isSolve ?
            this.state.inCorrect.length == 0 ?
              <h2 className="success">Udało się</h2> :
              <h2 className="error">Błąd</h2> : ""
        }
        {
          this.state.isCheckSolution ?
            this.state.isCorrect ?
              <h2 className="success">Udało się</h2> :
              <h2 className="error">Błąd</h2> : ""
        }
      </React.Fragment>
    )
  }
}

export default App;
