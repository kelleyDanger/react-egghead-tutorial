import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      txt: 'this is the state txt',
      cat: 0,
      currentEvent: '---',
      a: '',
      val: 0,
      items: [],
    }
    this.updateTextArea = this.updateTextArea.bind(this)
    this.updateVal = this.updateVal.bind(this)
  }

  updateTextArea(e){
    this.setState({currentEvent: e.type})
  }

  update( e ){
    this.setState({txt: e.target.value})
  }

  updateInput(e){
    this.setState({
      a: this.refs.a.value,
      b: this.refs.b.value,
      c: ReactDOM.findDOMNode(this.c).value
    })
  }

  updateVal(){
    this.setState({val: this.state.val + 1})
  }

  updateFoo(){
    ReactDOM.render(
      <App foo={this.props.foo+1} />,
      document.getElementById('root'))
  }

  componentWillMount(){
    console.log('componentWillMount')
    this.setState({m: 2})

    fetch( 'http://swapi.co/api/people/?format=json' )
      .then( response => response.json() )
      .then( ({results: items}) => this.setState({items}))
  }

  componentDidMount(){
    console.log('componentDidMount')
    this.increment = setInterval(this.updateVal,500)
  }

  componentWillUnmount(){
    console.log('componentWillUnmount')
    clearInterval(this.increment)
  }

  componentWillReceiveProps(nextProps){
    this.setState({increasing: nextProps.foo > this.props.foo})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.foo % 5 === 0;
  }

  componentDidUpdate(prevProps, prevState){
    console.log(`prevProps: ${prevProps.foo}`)
  }

  filter(e){
    this.setState({filter: e.target.value})
  }

  render(){
    let txt = this.props.txt
    console.log(this.state.increasing)
    let items = this.state.items
    if(this.state.filter){
      items = items.filter( item =>
        item.name.toLowerCase()
        .includes(this.state.filter.toLowerCase()))
    }

    return (
      <div id="intro">
        <Title text="1234567"/>

        <Widget update={this.update.bind(this)} />
        <h1 className="greeting">{this.state.txt} - {this.state.cat}</h1>
        <i>asshole</i>
        <br/>{txt}  <Button><Heart /> Click Me!</Button>

        <textarea
          onKeyPress={this.updateTextArea}
          onCopy={this.updateTextArea}
          onCut={this.updateTextArea}
          onPaste={this.updateTextArea}
          onFocus={this.updateTextArea}
          onBlur={this.updateTextArea}
          onDoubleClick={this.updateTextArea}
          onMouseOver={this.updateTextArea}
          onTouchStart={this.updateTextArea}
          onTouchMove={this.updateTextArea}
          onTouchEnd={this.updateTextArea}

          cols="30"
          rows="10" />
          <h1>CURRENT EVENT: {this.state.currentEvent}</h1>

          <input
            ref="a"
            type="text"
            onChange={this.updateInput.bind(this)}
          /> {this.state.a}
          <hr />
          <input
            ref="b"
            type="text"
            onChange={this.updateInput.bind(this)}
          /> {this.state.b}
          <hr />
          <input
            ref={ component => this.c = component}                 onChange={this.updateInput.bind(this)}
          /> {this.state.c}

          console.log('render');
          <br />
          COUNTER MULTIPLY: <button onClick={this.updateVal}>
            {this.state.val * this.state.m}
          </button>


          <hr />
          <button onClick={this.updateFoo.bind(this)}>
            {this.props.foo}
          </button>

          <hr />
          <div>
            FILTER NAME BY LETTER: <input type="text"
              onChange={this.filter.bind(this)} />
            {items.map(item =>
              <Person key={item.name} person={item}/>)}
          </div>

          <hr />
          <div>
            <Button2>button</Button2>
            <LabelHOC>label</LabelHOC>
          </div>
      </div>
    );
  }
}

App.propTypes = {
  txt: React.PropTypes.string,
  cat: React.PropTypes.number.isRequired
}

App.defaultProps = {
  txt: "this is the default text",
  foo: 0
}

const Widget = (props) =>
  <input type="text" onChange={props.update}/>

const Button = (props) =>
  <button>{props.children}</button>

class Heart extends React.Component {
  render(){
    return <span>&hearts;</span>
  }
}

const Title = (props) => <h1>Title: {props.text}</h1>
Title.propTypes = {
  //text: React.PropTypes.string.isRequired
  text(props, propName, component){
    if(!(propName in props)){
      return new Error(`Hold on, you are missing ${propName}`)
    }
    if(props[propName].length < 6){
      return new Error('#{propName} was too short')
    }
  }
}

class Input extends React.Component {
  render(){
    return <input type="text" onChange={this.props.updateInput} />
  }
}

class Wrapper extends React.Component {
  mount(){
    ReactDOM.render(<App />, document.getElementById('a'))
  }
  unmount(){
    ReactDOM.unmountComponentAtNode(document.getElementById('a'))
  }

  render(){
    return (
      <div>
        <button onClick={this.mount.bind(this)}>MOUNT</button>
        <button onClick={this.unmount.bind(this)}>UNMOUNT</button>
        <div id="a"></div>
      </div>
    )
  }
}

const Person = (props) => <h4>{props.person.name}</h4>

const HOC = (InnerComponent) => class extends React.Component {
  constructor(){
    super();
    this.state = {count: 0}
  }
  update(){
    this.setState({count: this.state.count+1})
  }
  render(){
    return(
      <InnerComponent
        {...this.props}
        {...this.state}
        update={this.update.bind(this)}
      />
    )
  }
}

const Button2 = HOC(
  (props) =>
    <button onClick={props.update}>{props.children} - {props.count}</button>)

class Label extends React.Component {
  render (){
    return(
      <label onMouseMove={this.props.update}>
        {this.props.children} - {this.props.count}
      </label>
    )
  }
}


const LabelHOC = HOC(Label)

export default App
//export default Wrapper
