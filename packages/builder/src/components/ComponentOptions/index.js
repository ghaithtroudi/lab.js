import React from 'react'
import { connect } from 'react-redux'

// Meta-screens
import Welcome from './components/Welcome'
import Fallback from './components/Fallback'

// General-purpose tabs
import Notes from './components/Notes'
import Responses from './components/Responses'
import Scripts from './components/Scripts'
import Parameters from './components/Parameters'
import Advanced from './components/Advanced'

// Content-specific tabs
import CanvasContent from './components/Content/Canvas'
import EditorContent from './components/Content/Editor'
import FrameContent from './components/Content/Frame'
import LoopContent from './components/Content/Loop'
import SequenceContent from './components/Content/Sequence'

// Tab selection helper
import { defaultTab } from '../../logic/components'

const selectTab = (type, tab) => {
  switch(tab) {
    case 'Notes':
      return Notes
    case 'Content':
      switch(type) {
        case 'lab.canvas.Screen':
          return CanvasContent
        case 'lab.html.Screen':
        case 'lab.html.Form':
          return EditorContent
        case 'lab.canvas.Frame':
        case 'lab.html.Frame':
          return FrameContent
        case 'lab.flow.Loop':
          return LoopContent
        case 'lab.flow.Sequence':
          return SequenceContent
        default:
          throw new Error(`Unknown component type, can't show content`)
      }
    case 'Responses':
      return Responses
    case 'Scripts':
      return Scripts
    case 'Parameters':
      return Parameters
    case 'More':
      return Advanced
    default:
      return ({ id, data }) =>
        <div>
          id: { id }, type: { data.type },
          tab: { data._tab }
        </div>
  }
}

const componentDetail = ({ id, type, tab, data }) => {
  // Catch special cases:
  // Welcome screen and unknown component fallback
  if (id === 'welcome') {
    return <Welcome />
  } else if (type === undefined) {
    return <Fallback />
  }

  // Select appropriate content tab
  const Tab = selectTab(type, tab)
  return <Tab
    id={ id }
    data={ data }
  />
}

// Redux integration
const mapStateToProps = (state) => {
  const id = state.componentDetail.viewProps.id

  // Provide default values
  // if a component does not exist
  const type = state.components[id]
    ? state.components[id].type
    : undefined
  const tab = state.components[id]
    ? defaultTab(state.components[id]._tab, type)
    : undefined
  const data = state.components[id]
    ? state.components[id]
    : {}

  return {
    key: `${ id }-${ tab }`,
    id, type, tab, data
  }
}

export default connect(mapStateToProps)(componentDetail)
