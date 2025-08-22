cmake_minimum_required(VERSION 3.31)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

project(bare_test C)

fetch_package("github:holepunchto/bare@1.21.7")

add_bare_bundle(
  bare_test_driver_bundle
  ENTRY lib/driver.js
  OUT lib/driver.bundle.h
  BUILTINS lib/builtins.json
)

add_executable(bare_test_driver)

target_sources(
  bare_test_driver
  PRIVATE
    lib/driver.bundle.h
    lib/driver.c
)

set_target_properties(
  bare_test_driver
  PROPERTIES
  OUTPUT_NAME bare-test-driver
  ENABLE_EXPORTS ON
  WINDOWS_EXPORT_ALL_SYMBOLS ON
)

target_link_libraries(
  bare_test_driver
  PUBLIC
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
  PRIVATE
    log_static
    rlimit_static
)

link_bare_module(bare_test_driver bare-fs)
link_bare_module(bare_test_driver bare-os)

bare_target(target)

install(
  TARGETS bare_test_driver
  DESTINATION prebuilds/${target}
)
