# Welcome to MMI AWS API

The main scope of this application is to start & stop aws ec2 instance. Where before start the instance we check the status of instance whether its available or not and do with respect to it.

### Installation

```
$ npm install mmi-aws-api
```

### Usage

copy below code to start ec2 instance inside `index.js`
```
var awsMMIApi = require('mmi-aws-api');
var instanceId = "blah";
var region = "blah";
awsMMIApi.startInstance(instanceId,region,function (response) {
  console.log(response);
});
```

copy below code to stop ec2 instance inside `index.js`
```
var awsMMIApi = require('mmi-aws-api');
var instanceId = "blah";
var region = "blah";
awsMMIApi.stopInstance(instanceId,region,function (response) {
  console.log(response);
});
```

then run
```
node index.js
```

### Prerequisites
1. At aws IAM add new user & permission to start & stop instance
2. Get the secret key & access key
3. copy below commands in terminal
``` 
  which python
  python --version
  pip --version
  sudo apt install python-pip
  pip install --user awscli
  which aws
```
4) it will ask access key, secret key & region 
```
  aws configure
```

### References:
1. [Install AWS CLI using Python PIP](https://www.youtube.com/watch?v=t4Jo3gjHcAg&list=PL34sAs7_26wMKAl2wcDXb7ko65V8KDBzG&index=4)
2. [Managing Amazon EC2 Instances using nodejs](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ec2-example-managing-instances.html)
