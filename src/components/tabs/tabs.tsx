import * as React from 'react';
import { Tab } from './tab';

export interface ITabsProps {
  activeTabName?: string;
  tabs: Tab[];
}

interface ITabsState {
  activeTab: Tab;
}

const defaultTab = new Tab({name:'Tab', content:(<span></span>)});

class Tabs extends React.Component<ITabsProps, ITabsState> {
  constructor(props: ITabsProps) {
    super(props);
    if (props.tabs.length === 0) {
      props.tabs.push(defaultTab);
    }

    this.state = {
      activeTab : props.activeTabName 
      ? (props.tabs.find(tab => tab.name === props.activeTabName) ?? props.tabs[0])
      : props.tabs[0]
    }
  }

  setActiveTab(tab: Tab) {
    this.setState({
      activeTab: tab
    });
  }

  public render() {
    
    return <div className="tab-container">
      <div className="tab-headers">
        {this.props.tabs.map(tab => 
          <span key={"tab-header-" + tab.name} className={"tab-header " + (tab === this.state.activeTab ? "active-tab-header" : "")}
            onClick={() => this.setActiveTab(tab)}
          >
            {tab.name}
          </span>
        )}
      </div>
      <div className="tab-content">{this.state.activeTab.content}</div>
    </div>
  }
}

export { Tabs };