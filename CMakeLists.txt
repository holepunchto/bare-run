cmake_minimum_required(VERSION 3.25)

find_package(cmake-bare-bundle REQUIRED PATHS node_modules/cmake-bare-bundle)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)

fetch_package("github:holepunchto/bare@1.16.2")

set(name bare_test)

set(BUNDLE_OUT lib/test.bundle.h)

project(${name} C)

add_bare_bundle(
  ${name}_bundle
  ENTRY ${TEST_FILE}
  OUT ${BUNDLE_OUT}
  BUILTINS lib/builtins.json
)

add_executable(${name})

target_sources(
  ${name}
  PRIVATE
    ${BUNDLE_OUT}
    lib/testbed.c
)

set_target_properties(
  ${name}
  PROPERTIES
  OUTPUT_NAME test
  ENABLE_EXPORTS ON
  MACOSX_BUNDLE OFF
  WINDOWS_EXPORT_ALL_SYMBOLS ON
)

target_link_libraries(
  ${name}
  PUBLIC
    $<LINK_LIBRARY:WHOLE_ARCHIVE,bare_static>
)

link_bare_modules(${name})

install(TARGETS ${name})
