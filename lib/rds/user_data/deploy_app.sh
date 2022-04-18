#!/bin/bash -xe

# version: 14Apr2020

#!/bin/bash
sudo yum update -y
sudo yum -y install httpd php mysql
sudo chkconfig httpd on
sudo service httpd start
sudo yum install -y mysql57 curl

curl "https://github.com/igormgomes"