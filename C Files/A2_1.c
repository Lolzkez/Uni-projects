#include <stdlib.h>
#include <stdio.h>
#include <string.h>

void count_letter_frequency(char* input_filename, int* letter_frequency);
void draw_frequency_barchart(char* output_filename, int* letter_frequency);

int main(int argc, char* argv[]) {
	if (argc != 3) {
		printf("./A2_%d input_filename output_filename\n", 1);
	}
	int freq[26] = { 0 };
	count_letter_frequency(argv[1], freq);
	draw_frequency_barchart(argv[2], freq);
	return 0;
}

void count_letter_frequency(char* input_filename, int* letter_frequency) {
	FILE *file;
	char word[50];
	int j;
	file = fopen(input_filename, "r");
	if (NULL == file) {printf("File cannot be opened \n");}
	while(fgets(word, 50, file) != NULL) {
		int i, num;
		for (i = 0; i < strlen(word); ++i) {
			if (word[i] >=65 && word[i] <=90) {
				word[i] = word[i] + 32;
				num = word[i] - 97;
				letter_frequency[num] += 1;
			}
			else if (word[i] >= 97 && word[i] <=122) {
				num = word[i] - 97;
				letter_frequency[num] += 1;
			}
		}
	}
}

void draw_frequency_barchart(char* output_filename, int* letter_frequency) {
	int i;
	FILE *file;
	file = fopen(output_filename, "w");
	if (NULL == file) {printf("File cannot be found \n");}
	for (i = 0; i < 26; ++i) {
		int j;
		char hash[] = "#";
		char mhash[30] = "";
		for (j = 0; j < letter_frequency[i]; ++j) {
			strcat(mhash, hash);
		}
	fprintf(file, "%c|%s%d\n", i+97, mhash, letter_frequency[i]);
	memset(mhash, 0, 30);
	}
	fclose(file);
}
