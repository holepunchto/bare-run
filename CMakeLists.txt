cmake_minimum_required(VERSION 3.31)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

project(bare_run C)

fetch_package("github:holepunchto/bare@1.21.8")

add_bare_bundle(
  bare_run_bundle
  ENTRY lib/driver.mjs
  OUT lib/driver.bundle.h
  BUILTINS lib/builtins.json
)

add_executable(bare_run)

target_sources(
  bare_run
  PRIVATE
    lib/driver.bundle.h
    lib/driver.c
)

set_target_properties(
  bare_run
  PROPERTIES
  OUTPUT_NAME bare-run
  ENABLE_EXPORTS ON
  WINDOWS_EXPORT_ALL_SYMBOLS ON
)

target_link_libraries(
  bare_run
  PUBLIC
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
  PRIVATE
    log_static
    rlimit_static
)

link_bare_module(bare_run bare-fs)
link_bare_module(bare_run bare-module)
link_bare_module(bare_run bare-module-lexer)
link_bare_module(bare_run bare-os)
link_bare_module(bare_run bare-url)

bare_target(target)

install(TARGETS bare_run DESTINATION ${target})
