import React from 'react'

export default class Renderer extends React.Component {
  componentDidMount() {
    this.renderFrame()
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps == null
      || this.props.component != prevProps.component
      || this.props.preview != prevProps.preview)
    this.renderFrame()
  }
  renderFrame() {
    let frame = this.refs.frame.getDOMNode()
    let loadHandler = () => {
      frame.contentWindow.removeEventListener('load', loadHandler, false)
      this.bind = false
      render()
    }
    let render = () => {
      var syntaxError = frame.contentWindow.render(this.props.component, this.props.preview)
      if (syntaxError == null) {
        return
      }
      if (syntaxError.isPreview) {
        this.props.onPreviewError(syntaxError)
      } else {
        this.props.onComponentError(syntaxError)
      }
    }

    if (frame.contentDocument.readyState != 'complete'
      || !('render' in frame.contentWindow)) {
      if (!this.bind) {
        frame.contentWindow.addEventListener('load', loadHandler, false)
        this.bind = true
      }
    } else {
      render()
    }
  }
  render() {
    return <div style={this.props.style}>
      <iframe ref="frame"
        src={this.props.src}
        style={{
          width: "100%",
          height: "100%",
          border: "none"
        }}/>
    </div>
  }
}

Renderer.propTypes = {
  src: React.PropTypes.string.isRequired,
  component: React.PropTypes.string,
  preview: React.PropTypes.string,
  onComponentError: React.PropTypes.func,
  onPreviewError: React.PropTypes.func
}

Renderer.defaultProps = {
  component: '',
  preview: '',
  onComponentError: () => {},
  onPreviewError: () => {}
}
