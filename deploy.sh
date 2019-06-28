#!/bin/sh
echo " 哈哈"

# 定义变量
ip="176.122.150.118"
port="3000"
ssh_port="28058"

# 执行命令

scp -r -P ${ssh_port} ../reptile-server joyt@${ip}:/home/joyt/project
