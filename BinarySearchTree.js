class Node {
    constructor(data = null){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr){
        arr.sort((a, b) => a-b);
        if (arr.length > 1){
            for(let i = 0; i < arr.length; i++){
                if (arr[i] == arr[i+1]){
                    arr.splice(i,1);
                }
            }
        }

        this.root = this.buildTree(arr);
    }

    buildTree(arr){
        if (arr == null || arr.length == 0){
            return null;
        }
        
        if (arr.length == 1){
            return new Node(arr[0]);
        }

        //calculate mid point of array
        let mid = Math.floor(arr.length/2);
        let node = new Node(arr[mid]);
        node.left = this.buildTree(arr.slice(0, mid));
        node.right = this.buildTree(arr.slice(mid+1, arr.length));

        return node;
    }

    levelOrder(callback = null) {
        const defaultCallback = (node) => {
            return node.data;
        }

        let queue = [this.root];
        let result = [];

        while(queue.length != 0){
            let frontOfQueue = queue.shift();
            if (callback != null){
                result = result.concat(callback(frontOfQueue));
            }
            else {
                result = result.concat(defaultCallback(frontOfQueue));
            }
            if (frontOfQueue.left != null)
                queue.push(frontOfQueue.left);
            if (frontOfQueue.right != null)
                queue.push(frontOfQueue.right);
        }

        return result;

    }
    
    inOrderTraversal(callback = null){
        const defaultCallback = (node) => {
            return node.data;
        } 

        return this.#inOrderRecurse(this.root, callback ?? defaultCallback);
    }
    
    #inOrderRecurse(node, callback) {
        let arr = [];

        if (node.left != null){
            arr = arr.concat(this.#inOrderRecurse(node.left, callback));
        }
        
        arr = arr.concat(callback(node));
        
        if (node.right != null){
            arr = arr.concat(this.#inOrderRecurse(node.right, callback));
        }

        return arr;
    }
    
    preOrderTraversal(callback = null){
        const defaultCallback = (node) => {
            return node.data;
        } 

        return this.#preOrderRecurse(this.root, callback ?? defaultCallback);
    }
    
    #preOrderRecurse(node, callback) {
        let arr = [];

        arr = arr.concat(callback(node));

        if (node.left != null){
            arr = arr.concat(this.#preOrderRecurse(node.left, callback));
        }
        
        if (node.right != null){
            arr = arr.concat(this.#preOrderRecurse(node.right, callback));
        }

        return arr;
    }
    
    postOrderTraversal(callback = null){
        const defaultCallback = (node) => {
            return node.data;
        } 

        return this.#postOrderRecurse(this.root, callback ?? defaultCallback);
    }
    
    #postOrderRecurse(node, callback) {
        let arr = [];

        if (node.left != null){
            arr = arr.concat(this.#postOrderRecurse(node.left, callback));
        }
        
        if (node.right != null){
            arr = arr.concat(this.#postOrderRecurse(node.right, callback));
        }

        arr = arr.concat(callback(node));

        return arr;
    }

    find(value) {
        let root = this.root;

        while(root != null){
            if (value == root.data){
                return root;
            }
            else if (value >= root.data){
                root = root.right;
            }
            else {
                root = root.left;
            }
        }

        return null;
    }
    
    height(value = null) {
        let node = this.find(value);
        return this.#heightRecurse(node);
    }
    
    #heightRecurse(node) {
        if (node == null){
            return 0;
        }
        
        let leftHeight = this.#heightRecurse(node.left);
        let rightHeight = this.#heightRecurse(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(value) {
        let root = this.root;
        let node = this.find(value);

        if (node == null){
            return 0;
        }

        let count = 0;
        while(root != null){
            if (root == node){
                return count;
            }
            else if (value > root.data){
                root = root.right;
            }
            else {
                root = root.left;
            }
            count++;
        }

        return count;
    }
    
    insert(value){
        let currentNode = this.root;
        let previousNode = null;
        
        while(currentNode != null){
            if (value == currentNode.data){
                return;
            }
            if (value > currentNode.data){
                previousNode = currentNode;
                currentNode = currentNode.right;
            }
            else {
                previousNode = currentNode;
                currentNode = currentNode.left;
            }
        }

        if (value > previousNode.data){
            previousNode.right = new Node(value);
        }
        else {
            previousNode.left = new Node(value);
        }
    }
    
    delete(value){
        let itemToDelete = this.find(value);

        if (itemToDelete == null){
            return;
        }

        this.#deleteNode(this.root, itemToDelete);
    }

    #deleteNode(root, itemToDelete){

        let node = root;
        let parentNode = null;
        while(node != null){
            if (itemToDelete.data == node.data){
                break;
            }
            if (itemToDelete.data > node.data){
                parentNode = node;
                node = node.right;
            }
            else {
                parentNode = node;
                node = node.left;
            }
        }

        if (itemToDelete.left == null && itemToDelete.right == null){
            if (parentNode.left == itemToDelete)
                parentNode.left = null;
            else
                parentNode.right = null;

            return;
        }

        if (itemToDelete.left == null || itemToDelete.right == null){
            if (parentNode.left == itemToDelete){
                if (itemToDelete.left == null){
                    parentNode.left = itemToDelete.right;
                }
                else {
                    parentNode.left = itemToDelete.left;
                }
            }
            else {
                if (itemToDelete.left == null){
                    parentNode.right = itemToDelete.right;
                }
                else {
                    parentNode.right = itemToDelete.left;
                }
            }

            return;
        }

        //find smallest node in itemToDelete's right subtree
        let rightSubTree = itemToDelete.right;
        let smallestNode = rightSubTree
        while(rightSubTree != null){
            if (rightSubTree.data < smallestNode.data){
                smallestNode = rightSubTree;
            }

            rightSubTree = rightSubTree.left;
        }

        console.log("Deleting: ",smallestNode);
        console.log("From: ", itemToDelete.right);
        this.#deleteNode(itemToDelete, smallestNode);
        itemToDelete.data = smallestNode.data;
    }
    
    isBalanced() {
        return Math.abs(this.#heightRecurse(this.root.left) - this.#heightRecurse(this.root.right)) <= 1;
    }
    
    rebalance(){
        if (!this.isBalanced()){
            console.log("Rebalancing Tree...");
            let arr = this.inOrderTraversal();
            
            this.root = this.buildTree(arr);
        }
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

let arr = Array.from({length: 16}, () => Math.floor(Math.random() * 100));
let bst = new Tree(arr);

prettyPrint(bst.root);

console.log("Is Balanced: ", bst.isBalanced())

console.log("LevelOrder: ", bst.levelOrder());
console.log("InOrder: ", bst.inOrderTraversal());
console.log("PreOrder: ", bst.preOrderTraversal());
console.log("PostOrder: ", bst.postOrderTraversal());

bst.insert(101);
bst.insert(150);
bst.insert(200);
bst.insert(250);

prettyPrint(bst.root);

console.log("Is Balanced (x2): ", bst.isBalanced());
bst.rebalance();
console.log("Is Balanced (x3): ", bst.isBalanced());

prettyPrint(bst.root);

console.log("LevelOrder: ", bst.levelOrder());
console.log("InOrder: ", bst.inOrderTraversal());
console.log("PreOrder: ", bst.preOrderTraversal());
console.log("PostOrder: ", bst.postOrderTraversal());
