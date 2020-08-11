import * as React from 'react';

export interface ITabProps {
  name: string;
  content: React.ReactElement<any>;
}

class Tab {
  public name: string;
  public content: React.ReactElement<any>;

  constructor(props: ITabProps) {
    this.name = props.name;
    this.content = props.content;
  }
}

export { Tab };
