#include <stdio.h>

void process_file(char *filename);

int main(int argc, char *argv[])
{
    if (argc != 2) {
        printf("Usage: ./Tutorial7 filename\n");
    }
    else {
        process_file(argv[1]);
        return 0;
    }
}
void process_file(char *filename) {
    FILE *file;
    char name[20];
    float m1, m2, m3, avg;
    file = fopen(filename, "r");
    while (fscanf(file, "%s %f,%f,%f", name, &m1, &m2, &m3) != EOF) {
        avg = (m1 + m2 + m3)/3;
        printf("Average mark for %s = %f\n", name, avg);
    }
}