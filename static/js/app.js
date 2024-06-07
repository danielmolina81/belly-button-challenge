// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filtered_metadata = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for(let key in filtered_metadata) {
      let capitalizedkey = key.toUpperCase();
      panel.append('p').text(`${capitalizedkey}: ${filtered_metadata[key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtered_sample = samples.filter(x => x.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filtered_sample.otu_ids;
    let otu_labels = filtered_sample.otu_labels;
    let sample_values = filtered_sample.sample_values;

    // Build a Bubble Chart
    let tracebubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        colorscale: 'Jet',
        size: sample_values
      },
      text: otu_labels
    };

    let databubble = [tracebubble];

    let layoutbubble = {
      title: 'Bacteria Cultures Per Sample',
      xaxis:{
        title: "OTU ID"
      },
      yaxis:{
        title: "Number of Bacteria"
      },
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", databubble, layoutbubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let ysticks = otu_ids.map(function (item) {
      return (`OTU ${item.toString()}`);
    });

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sortedbar = sample_values.map((value, index) => ({value, id: ysticks[index], label: otu_labels[index]}))
    .sort((a, b) => b.value - a.value);

    let slicedbar = sortedbar.slice(0, 10).reverse();

    let tracebar = {
      x: slicedbar.map(item => item.value),
      y: slicedbar.map(item => item.id),
      text: slicedbar.map(item => item.label),
      type: 'bar',
      orientation: "h"
    };

    let databar = [tracebar];

    let layoutbar = {
      title: "Top 10 Bateria Cultures Found",
      xaxis:{
        title: "Number of Bacteria"
      },
      yaxis:{
        title: "OTU ID"
      },
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    
    // Render the Bar Chart
    Plotly.newPlot("bar", databar, layoutbar);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(i=0; i < names.length; i++){
      dropdown.append("option").text(names[i]);
    }

    // Get the first sample from the list
    let first_sample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  let dropdown = d3.select("#selDataset");
  dropdown.attr(newSample);
  
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
