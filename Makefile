include local.mk
CC=chpl
MODS=-M$(NUMSUCH_HOME)/src -M$(RELCH_HOME)/src -M$(CHINGON_HOME)/src -M$(EPOCH_HOME)/src -M$(MOSCHITTO_HOME)/src -lwebsockets
#MODS=-M$(NUMSUCH_HOME)/src -M$(CHINGON_HOME)/src -M$(MOSCHITTO_HOME)/src -lwebsockets
SRC_DIR=src
BUILD_DIR=build
LIBS=-L$(BLAS_HOME)/lib -lblas

default: $(SRC_DIR)/theseus.chpl
	$(CC) $(LIBS) $(MODS) -o $(BUILD_DIR)/theseus $<

run:
	./$(BUILD_DIR)/theseus -f $(SRC_DIR)/theseus.cfg
