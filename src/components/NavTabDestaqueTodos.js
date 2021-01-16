import { Tab, Tabs } from 'react-bootstrap';
import React from 'react';
import {InfoFundos} from "./InfoFundos.js";

export class NavTabDestaqueTodos extends React.Component {
  constructor(props) {
    super();
    this.state = {
      // define a tab ativa apartir do props se definido
      activeTab: props.activeTab || 1
    };
    
    // função de seleção aqui (não no render)
    this.handleSelect = this.handleSelect.bind(this);
  }
  
  render() {
    return (
        <div className="box-info-fundos-tabs">
            <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect}>
                <Tab eventKey={1} title="DESTAQUES" class=""><InfoFundos/></Tab>
                <Tab eventKey={2} title="TODOS">Tab 2 content</Tab>
            </Tabs>
        </div>
    );
  }
  
  handleSelect(selectedTab) {
    // a tab ativa tem que ser definida no state
    // para o tabs component ver a mudança e renderizar
    this.setState({
      activeTab: selectedTab
    });
  }
}