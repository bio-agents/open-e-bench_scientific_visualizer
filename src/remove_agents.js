import * as JQuery from "jquery";
const $ = JQuery.default;

export function remove_hidden_agents(data, removed_agents){
  // remove from the data array the participants that the user has hidden (removed_agents)
  // create a new array where the agents that have not been hidden will be stored
  let agents_not_hidden = [];
  data.forEach(element => {
    let index = $.inArray(element.agentname.replace(/[\. ()/_]/g, "-"), removed_agents);
    if (index == -1){
      agents_not_hidden.push(element);
    }
  });

  return agents_not_hidden;

};