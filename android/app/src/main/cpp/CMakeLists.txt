cmake_minimum_required(VERSION 3.18.1)
project(cyberpty C)

add_library(cyberpty SHARED pty.c)
target_compile_options(cyberpty PRIVATE -Wall -O2)
target_link_libraries(cyberpty log)
