var nodes = null;
var edges = null;
var network = null;

function draw(transfers) {
    console.log('transfers', transfers)
    const nodesSet = new Set()
    for (let [from, to, amount] of transfers) {
        nodesSet.add(from)
        nodesSet.add(to)
    }
    console.log('nodesSet', nodesSet)
    let i = 0
    const nodes = [...nodesSet].map(label => ({ id: ++i, label: label, shape: "box", }))
    console.log('nodes', nodes)

    const getIdByName = name => {
        for (let { id, label } of nodes) {
            if (name === label) return id
        }
        console.error(`Node ${name} not found`)
        return null
    }

    const edges = transfers.map(([from, to, amount]) => {
        return {
            from: getIdByName(from), to: getIdByName(to), value: amount, arrows: {
                to: {
                    enabled: true,
                }
            }
        }
    })

    for (let item of edges) { item.label = '' + item.value }

    // Instantiate our network object.
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: "dot",
            scaling: {
                customScalingFunction: function (min, max, total, value) {
                    return value / total;
                },
                min: 5,
                max: 150
            }
        }
    };
    network = new vis.Network(container, data, options);
}

window.addEventListener("load", () => {
    const defaultHashData = [
        ['Person one', 'Person two', 300000],
        ['Person two', 'Person 3', 20000],
        ['Person 3', 'Person One', 10000],
        ['Unknown person', 'Person One', 5000],
        ['Unknown person', 'Person 3', 1200],
    ].map(line => line.join(',')).join('|')

    if (location.hash === '') {
        location.hash = defaultHashData
    }
    const items = location.hash.slice(1).split('|').map(item => item.split(',').map(decodeURIComponent))
    draw(items);
});
