function checkAwsStatus (instanceId, region, mode, res, cb) {
  var AWS = require("aws-sdk");
  var ec2 = new AWS.EC2({region:region});
  var params = {
    InstanceIds: [instanceId]
    ,DryRun: false
  };
  ec2.describeInstances(params, function(err, data) {
    console.log(err,data);
    if (err) {
      res['msg'] = "Instance id passed is wrong";
      res['err'] = err;
      if(cb) cb(res);
    } else {
      if(data && data.Reservations.length) {
        if(data.Reservations[0].Instances.length) {
          if(data.Reservations[0].Instances[0].State) {
            if(data.Reservations[0].Instances[0].State.Name == 'pending' && 
               data.Reservations[0].Instances[0].State.Code == 0) {
              // console.log('instance pending');              
              checkAwsStatus(instanceId, region, mode, res, cb);
            } else if(data.Reservations[0].Instances[0].State.Name == 'running' && 
                      data.Reservations[0].Instances[0].State.Code == 16 &&
                      data.Reservations[0].Instances[0].PublicIpAddress) {            
              // console.log('instance running');
              if(mode == 'stop') {
                stopInstanceWrap(ec2, params, res, cb);
              } else {
                res['id'] = data.Reservations[0].Instances[0].PublicIpAddress;
                res['instanceId'] = params.InstanceIds[0];
                res['msg'] = "Your public ip address "+data.Reservations[0].Instances[0].PublicIpAddress+ " for instance id "+params.InstanceIds[0];
                if(cb) cb(res);    
              }
            } else if(data.Reservations[0].Instances[0].State.Name == 'stopping' && 
                      data.Reservations[0].Instances[0].State.Code == 64) {
              // console.log('instance stopping');
              checkAwsStatus(instanceId, region, mode, res, cb);
            } else if(data.Reservations[0].Instances[0].State.Name == 'stopped' &&
                      data.Reservations[0].Instances[0].State.Code == 80) {
              // console.log('instance stopped');
              if(mode == 'start') {
                startInstanceWrap(ec2, params, mode, region, res, cb);
              } else {
                res['instanceId'] = params.InstanceIds[0];
                res['msg'] = "Instance id "+params.InstanceIds[0]+" is not running";
                if(cb) cb(res);    
              }
            }
          }
        }
      }
    }
  });
}

function startInstanceWrap (ec2, params, mode, region, res, cb) { 
  params.DryRun = true;
  ec2.startInstances(params, function(err, data) {
    if (err && err.code === 'DryRunOperation') {
      params.DryRun = false;
      ec2.startInstances(params, function(err, data) {
        if (err) {
          res['msg'] = "500 error!!!";
          res['err'] = err;
          if(cb) cb(res);    
        } else if (data) {
          checkAwsStatus(params.InstanceIds[0], region, mode, res, cb);          
        }
      });
    } else {
      res['msg'] = "500 error!!! You don't have permission to start instances.";
      res['err'] = err;
      if(cb) cb(res);   
    }
  });
}

function stopInstanceWrap (ec2, params, res, cb) { 
  params.DryRun = true;
  ec2.stopInstances(params, function(err, data) {
    if (err && err.code === 'DryRunOperation') {
      params.DryRun = false;
      ec2.stopInstances(params, function(err, data) {
        if (err) {
          res['err'] = err;
          res['msg'] = "500 error!!!";
          if(cb) cb(res);    
        } else if (data) {
          res['instanceId'] = params.InstanceIds[0];
          res['msg'] = "Instance id "+params.InstanceIds[0]+" stopped";
          if(cb) cb(res);    
        }
      });
    } else {
      res['msg'] = "500 error!!! You don't have permission to stop instances.";
      res['err'] = err;
      if(cb) cb(res);   
    }
  });
}

exports.startInstance = function (instanceId, region, cb) {
  var res = { 
    msg:"instanceId is not added"
  };
  if(instanceId && region) {
    checkAwsStatus(instanceId, region, "start", res, cb);    
  } else {
    if(cb) cb(res);
  }  
}

exports.stopInstance = function (instanceId, region, cb) {
  var res = { 
    msg:"instanceId is not added"
  };
  if(instanceId && region) {
    checkAwsStatus(instanceId, region, "stop", res, cb);    
  } else {
    if(cb) cb(res);
  }  
}
